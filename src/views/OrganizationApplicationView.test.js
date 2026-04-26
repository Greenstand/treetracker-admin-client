import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import OrganizationApplicationView from './OrganizationApplicationView';
import { createOrganization } from 'api/organizations';
import { ensureFreshToken, getUserFromToken } from 'auth/keycloak';
import { AppContext } from 'context/AppContext';

jest.mock(
  'components/common/Menu',
  () =>
    function Menu() {
      return null;
    }
);

jest.mock('api/organizations', () => ({
  createOrganization: jest.fn(),
}));

jest.mock('auth/keycloak', () => ({
  ensureFreshToken: jest.fn(),
  getUserFromToken: jest.fn(),
}));

describe('OrganizationApplicationView', () => {
  let queryClient;
  let history;
  let appContextValue;

  function renderView() {
    return render(
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={appContextValue}>
          <Router history={history}>
            <OrganizationApplicationView />
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    );
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    history = createMemoryHistory({ initialEntries: ['/organization/apply'] });
    appContextValue = {
      isKeycloakEnabled: false,
      login: jest.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('submits the organization form and redirects to home', async () => {
    createOrganization.mockResolvedValueOnce({ id: 178, name: 'FCC' });

    renderView();

    await userEvent.type(screen.getByLabelText(/organization name/i), ' FCC ');
    await userEvent.type(
      screen.getByLabelText(/email/i, { selector: 'input' }),
      ' fcc@example.com '
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    await waitFor(() => {
      expect(createOrganization).toHaveBeenCalledWith({
        name: 'FCC',
        email: 'fcc@example.com',
        phone: '',
        website: '',
        logoUrl: '',
        mapName: '',
      });
    });

    expect(
      await screen.findByText(/organization created successfully/i)
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(history.location.pathname).toBe('/');
      },
      { timeout: 2000 }
    );
  });

  it('refreshes keycloak auth state after successful organization creation', async () => {
    createOrganization.mockResolvedValueOnce({ id: 178, name: 'FCC' });
    ensureFreshToken.mockResolvedValueOnce('fresh-token');
    getUserFromToken.mockReturnValueOnce({
      id: 'user-1',
      roleNames: ['org'],
      policy: {
        policies: [{ name: 'org' }],
        organization: undefined,
      },
    });
    appContextValue = {
      isKeycloakEnabled: true,
      login: jest.fn(),
    };

    renderView();

    await userEvent.type(screen.getByLabelText(/organization name/i), 'FCC');
    await userEvent.type(
      screen.getByLabelText(/email/i, { selector: 'input' }),
      'fcc@example.com'
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    await waitFor(() => {
      expect(ensureFreshToken).toHaveBeenCalledWith(-1);
      expect(appContextValue.login).toHaveBeenCalledWith(
        expect.objectContaining({
          roleNames: ['org'],
        }),
        'Bearer fresh-token'
      );
    });
  });

  it('shows live validation errors and blocks invalid submission', async () => {
    renderView();

    await userEvent.type(screen.getByLabelText(/organization name/i), 'FCC');
    await userEvent.type(
      screen.getByLabelText(/email/i, { selector: 'input' }),
      'not-an-email'
    );

    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    expect(createOrganization).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /create organization/i })
    ).toBeDisabled();
  });

  it('shows a specific message when user already has organization role', async () => {
    createOrganization.mockRejectedValueOnce({
      response: {
        data: {
          error: {
            code: 'ORGANIZATION_ROLE_ALREADY_ASSIGNED',
            message: 'User already belongs to an organization',
          },
        },
      },
    });

    renderView();

    await userEvent.type(screen.getByLabelText(/organization name/i), 'FCC');
    await userEvent.type(
      screen.getByLabelText(/email/i, { selector: 'input' }),
      'fcc@example.com'
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    expect(
      await screen.findByText(/you already belong to an organization/i)
    ).toBeInTheDocument();
    expect(history.location.pathname).toBe('/organization/apply');
  });

  it('shows a specific message when organization role assignment fails', async () => {
    createOrganization.mockRejectedValueOnce({
      response: {
        data: {
          error: {
            code: 'ORGANIZATION_ROLE_ASSIGNMENT_FAILED',
            message: 'Organization role assignment failed',
          },
        },
      },
    });

    renderView();

    await userEvent.type(screen.getByLabelText(/organization name/i), 'FCC');
    await userEvent.type(
      screen.getByLabelText(/email/i, { selector: 'input' }),
      'fcc@example.com'
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    expect(
      await screen.findByText(/Failed To create an organization/i)
    ).toBeInTheDocument();
    expect(history.location.pathname).toBe('/organization/apply');
  });
});
