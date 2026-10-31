import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route } from 'react-router-dom';

import WalletsView from './WalletsView';
import { getWallets } from 'api/wallets';

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

jest.mock('api/wallets', () => ({
  getWallets: jest.fn(),
}));

const WALLETS = [
  {
    id: 'a1',
    name: 'alpha-wallet',
    display_name: 'Alpha',
    about: 'first',
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'b2',
    name: 'beta-wallet',
    display_name: null,
    about: null,
    created_at: '2026-01-03T00:00:00.000Z',
  },
];

describe('WalletsView', () => {
  let queryClient;

  // Returns a getter for the current location, so tests can assert the url.
  function renderView(entry = '/wallets') {
    let location;
    render(
      <MemoryRouter initialEntries={[entry]}>
        <QueryClientProvider client={queryClient}>
          <WalletsView />
          <Route
            path="*"
            render={({ location: l }) => {
              location = l;
              return null;
            }}
          />
        </QueryClientProvider>
      </MemoryRouter>
    );
    return () => location;
  }

  function setMatchMedia(matches) {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('fetches the first page on mount and renders wallet rows', async () => {
    getWallets.mockResolvedValueOnce({ wallets: WALLETS, total: 2 });

    renderView();

    expect(await screen.findByText('alpha-wallet')).toBeInTheDocument();
    expect(screen.getByText('beta-wallet')).toBeInTheDocument();
    expect(getWallets).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, rowsPerPage: 25, search: '' })
    );
  });

  it('shows a dash for a wallet with no display name or about', async () => {
    getWallets.mockResolvedValueOnce({ wallets: [WALLETS[1]], total: 1 });

    renderView();

    await screen.findByText('beta-wallet');
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('shows an empty state when there are no wallets', async () => {
    getWallets.mockResolvedValueOnce({ wallets: [], total: 0 });

    renderView();

    expect(await screen.findByText(/no wallets found/i)).toBeInTheDocument();
  });

  it('shows the error message when the request fails', async () => {
    getWallets.mockRejectedValueOnce(new Error('Request failed'));

    renderView();

    expect(await screen.findByText('Request failed')).toBeInTheDocument();
  });

  it('searches by name, debounced, and resets to the first page', async () => {
    getWallets.mockResolvedValue({ wallets: WALLETS, total: 2 });

    renderView();
    await screen.findByText('alpha-wallet');

    userEvent.type(screen.getByLabelText(/search by name/i), 'alpha');

    await waitFor(() =>
      expect(getWallets).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'alpha', skip: 0 })
      )
    );
  });

  describe('URL state', () => {
    it('starts on the page named by the url', async () => {
      getWallets.mockResolvedValue({ wallets: WALLETS, total: 200 });

      renderView('/wallets?page=3&rowsPerPage=50&search=alpha&sort=oldest');

      await waitFor(() =>
        expect(getWallets).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 150,
            rowsPerPage: 50,
            search: 'alpha',
            order: 'asc',
          })
        )
      );
    });

    it('writes the page into the url when it changes', async () => {
      getWallets.mockResolvedValue({ wallets: WALLETS, total: 200 });
      const location = renderView();

      await screen.findByText('alpha-wallet');
      await userEvent.click(screen.getByTitle('Next page'));

      await waitFor(() => expect(location().search).toBe('?page=1'));
    });

    it('keeps defaults out of the url', async () => {
      getWallets.mockResolvedValue({ wallets: WALLETS, total: 2 });
      const location = renderView();

      await screen.findByText('alpha-wallet');

      expect(location().search).toBe('');
    });

    it('ignores url values the ui cannot produce', async () => {
      getWallets.mockResolvedValue({ wallets: WALLETS, total: 2 });

      renderView('/wallets?page=-4&rowsPerPage=7&sort=sideways');

      await waitFor(() =>
        expect(getWallets).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 0,
            rowsPerPage: 25,
            sortBy: 'created_at',
            order: 'desc',
          })
        )
      );
    });
  });
});
