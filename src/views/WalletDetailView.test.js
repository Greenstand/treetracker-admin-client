import {
  cleanup,
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route } from 'react-router-dom';

import WalletDetailView from './WalletDetailView';
import { bindKeycloakAccount, getWallet } from 'api/wallets';
import { getKeycloakUser, searchKeycloakUsers } from 'api/keycloakUsers';

jest.mock(
  'components/common/Menu',
  () =>
    function Menu() {
      return null;
    }
);

jest.mock(
  'components/Navbar',
  () =>
    function Navbar() {
      return null;
    }
);

jest.mock('api/wallets', () => ({
  getWallet: jest.fn(),
  bindKeycloakAccount: jest.fn(),
}));

jest.mock('api/keycloakUsers', () => ({
  getKeycloakUser: jest.fn(),
  searchKeycloakUsers: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const UNBOUND_WALLET = {
  id: 'w1',
  name: 'wallet-legacy-01',
  keycloak_account_id: null,
};

const ACCOUNT = {
  id: 'kc-1',
  username: 'grower',
  email: 'grower@example.com',
  firstName: 'Gro',
  lastName: 'Wer',
};

describe('WalletDetailView', () => {
  let queryClient;

  function renderView() {
    return render(
      <MemoryRouter initialEntries={['/wallets/w1']}>
        <QueryClientProvider client={queryClient}>
          <Route path="/wallets/:walletId">
            <WalletDetailView />
          </Route>
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('shows an empty keycloak id for an unbound wallet', async () => {
    getWallet.mockResolvedValue(UNBOUND_WALLET);

    renderView();

    expect(await screen.findByTestId('wallet-name')).toHaveTextContent(
      'wallet-legacy-01'
    );
    expect(screen.getByTestId('wallet-keycloak-id')).toHaveTextContent('');
    expect(getKeycloakUser).not.toHaveBeenCalled();
  });

  it('shows the keycloak id and the account behind it once bound', async () => {
    getWallet.mockResolvedValue({
      ...UNBOUND_WALLET,
      keycloak_account_id: 'kc-1',
    });
    getKeycloakUser.mockResolvedValue(ACCOUNT);

    renderView();

    expect(await screen.findByTestId('wallet-keycloak-id')).toHaveTextContent(
      'kc-1'
    );
    await waitFor(() =>
      expect(screen.getByTestId('wallet-keycloak-user')).toHaveTextContent(
        'Gro Wer'
      )
    );
    expect(getKeycloakUser).toHaveBeenCalledWith('kc-1');
  });

  // Longer budget than the 5s default: the search box debounces by 500ms.
  it('searches accounts and binds the one the admin picks', async () => {
    getWallet.mockResolvedValue(UNBOUND_WALLET);
    searchKeycloakUsers.mockResolvedValue([ACCOUNT]);
    bindKeycloakAccount.mockResolvedValue({
      ...UNBOUND_WALLET,
      keycloak_account_id: 'kc-1',
    });

    renderView();

    userEvent.click(await screen.findByTestId('bind-keycloak-account'));
    // One change event rather than per-character typing: the box debounces by
    // 500ms, and each keystroke would restart that timer.
    fireEvent.change(screen.getByTestId('keycloak-account-search'), {
      target: { value: 'grower' },
    });

    const option = await screen.findByText('Gro Wer', {}, { timeout: 10000 });
    userEvent.click(option);
    userEvent.click(screen.getByTestId('bind-keycloak-submit'));

    await waitFor(() =>
      expect(bindKeycloakAccount).toHaveBeenCalledWith('w1', 'kc-1')
    );
  }, 20000);

  it('reports a failure to load the wallet', async () => {
    getWallet.mockRejectedValue(new Error('nope'));

    renderView();

    expect(await screen.findByText('nope')).toBeInTheDocument();
  });
});
