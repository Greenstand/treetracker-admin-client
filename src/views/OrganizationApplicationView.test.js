import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import OrganizationApplicationView from './OrganizationApplicationView';
import { createOrganization } from 'api/organizations';

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

describe('OrganizationApplicationView', () => {
  let queryClient;
  let history;

  function renderView() {
    return render(
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <OrganizationApplicationView />
        </Router>
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
});
