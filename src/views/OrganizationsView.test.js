import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import OrganizationsView from './OrganizationsView';
import { getOrganizations, updateOrganization } from 'api/organizations';

const mockMenu = jest.fn(() => null);
const mockNavbar = jest.fn(() => null);

jest.mock(
  'components/common/Menu',
  () =>
    function Menu(props) {
      return mockMenu(props);
    }
);

jest.mock(
  'components/Navbar',
  () =>
    function Navbar(props) {
      return mockNavbar(props);
    }
);

jest.mock('api/organizations', () => ({
  getOrganizations: jest.fn(),
  updateOrganization: jest.fn(),
  deleteOrganization: jest.fn(),
}));

const ORGS = [
  {
    id: 1,
    name: 'Alpha Org',
    email: 'alpha@example.com',
    phone: '+232 100 0001',
    website: 'https://alpha.example.com',
  },
  {
    id: 2,
    name: 'Beta Org',
    email: 'beta@example.com',
    phone: '+232 100 0002',
    website: 'https://beta.example.com',
  },
];

describe('OrganizationsView', () => {
  let queryClient;

  function renderView(initialUrl = '/') {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <QueryClientProvider client={queryClient}>
          <OrganizationsView />
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  function setMatchMedia(matches) {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  }

  beforeAll(() => {
    setMatchMedia(false);
  });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('fetches the first page on mount and renders organization rows', async () => {
    getOrganizations.mockResolvedValueOnce({ organizations: ORGS, total: 2 });

    renderView();

    expect(await screen.findByText('Alpha Org')).toBeInTheDocument();
    expect(screen.getByText('beta@example.com')).toBeInTheDocument();
    expect(getOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, rowsPerPage: 25, search: '' })
    );
  });

  it('shows an empty state when there are no organizations', async () => {
    getOrganizations.mockResolvedValueOnce({ organizations: [], total: 0 });

    renderView();

    expect(
      await screen.findByText(/no organizations found/i)
    ).toBeInTheDocument();
  });

  it('fetches the next page with an incremented skip when paging forward', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 100 });

    renderView();
    await screen.findByText('Alpha Org');

    await userEvent.click(screen.getByRole('button', { name: /next page/i }));

    await waitFor(() =>
      expect(getOrganizations).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 25, rowsPerPage: 25 })
      )
    );
  });

  it('shows an error alert when the request fails', async () => {
    getOrganizations.mockRejectedValueOnce(new Error('Network error'));

    renderView();

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Network error')).toBeInTheDocument();
  });

  it('refetches with search term after debounce', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 2 });

    renderView();
    await screen.findByText('Alpha Org');

    const input = screen.getByPlaceholderText(/search by name or phone/i);
    fireEvent.change(input, { target: { value: 'free' } });

    // Flush React's state update from the change event, then wait for the
    // 300 ms debounce + React Query to fire.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(getOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'free', skip: 0 })
    );
  });

  it('resets to page 0 when the search term changes', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 100 });

    renderView();
    await screen.findByText('Alpha Org');

    // Advance to page 1.
    await userEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() =>
      expect(getOrganizations).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 25 })
      )
    );

    // Typing a new search term should reset skip to 0.
    fireEvent.change(screen.getByPlaceholderText(/search by name or phone/i), {
      target: { value: 'free' },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(getOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'free', skip: 0 })
    );
  });

  it('refetches with the selected sort order and resets to page 0', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 2 });

    renderView();
    await screen.findByText('Alpha Org');

    // Open the Sort select and choose "Name Z→A".
    await userEvent.click(screen.getByLabelText(/sort/i));
    const listbox = await screen.findByRole('listbox');
    await userEvent.click(within(listbox).getByText('Name Z→A'));

    await waitFor(() =>
      expect(getOrganizations).toHaveBeenCalledWith(
        expect.objectContaining({ order: ['name DESC'], skip: 0 })
      )
    );
  });

  it('pre-populates search and sort from URL params on mount', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 2 });

    renderView('/?search=free&sort=newest');

    // Search input should be pre-filled.
    expect(screen.getByPlaceholderText(/search by name or phone/i).value).toBe(
      'free'
    );

    // API should be called with the URL-derived values.
    await waitFor(() =>
      expect(getOrganizations).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'free', order: ['id DESC'] })
      )
    );
  });

  it('edits an existing organization', async () => {
    getOrganizations.mockResolvedValue({ organizations: ORGS, total: 2 });
    updateOrganization.mockResolvedValueOnce({ id: 1, name: 'Alpha Renamed' });

    renderView();
    await screen.findByText('Alpha Org');

    await userEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);

    const dialog = await screen.findByRole('dialog');
    const nameField = within(dialog).getByLabelText(/organization name/i);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Alpha Renamed');
    await userEvent.click(
      within(dialog).getByRole('button', { name: /save/i })
    );

    await waitFor(() =>
      expect(updateOrganization).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: 'Alpha Renamed' })
      )
    );
  });

  it('renders the mobile card layout and navbar on small screens', async () => {
    setMatchMedia(true);
    getOrganizations.mockResolvedValueOnce({ organizations: ORGS, total: 2 });

    renderView();

    expect(await screen.findByText('Alpha Org')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getAllByText('Email:')).toHaveLength(ORGS.length);
    expect(screen.queryByText(/rows per page/i)).not.toBeInTheDocument();
    expect(screen.getByText('1-2/2')).toBeInTheDocument();
    expect(mockNavbar).toHaveBeenCalled();
    expect(mockMenu).not.toHaveBeenCalled();
  });
});
