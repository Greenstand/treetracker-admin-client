import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

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

  function renderView() {
    return render(
      <MemoryRouter initialEntries={['/wallets']}>
        <QueryClientProvider client={queryClient}>
          <WalletsView />
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
});
