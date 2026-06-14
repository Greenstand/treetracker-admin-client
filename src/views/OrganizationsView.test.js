import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import OrganizationsView from './OrganizationsView';
import { getOrganizations } from 'api/organizations';

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

  function renderView() {
    return render(
      <QueryClientProvider client={queryClient}>
        <OrganizationsView />
      </QueryClientProvider>
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
    expect(getOrganizations).toHaveBeenCalledWith({ skip: 0, rowsPerPage: 25 });
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
      expect(getOrganizations).toHaveBeenCalledWith({
        skip: 25,
        rowsPerPage: 25,
      })
    );
  });

  it('shows an error alert when the request fails', async () => {
    getOrganizations.mockRejectedValueOnce(new Error('Network error'));

    renderView();

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Network error')).toBeInTheDocument();
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
