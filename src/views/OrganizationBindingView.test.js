import React from 'react';
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-ui/core/styles';

import OrganizationBindingView from './OrganizationBindingView';
import { AppContext } from 'context/AppContext';
import { getMyBinding, requestBinding } from 'api/organizationBinding';
import theme from 'components/common/theme';

jest.mock(
  'components/common/Menu',
  () =>
    function Menu() {
      return null;
    }
);

jest.mock('api/organizationBinding', () => ({
  getMyBinding: jest.fn(),
  requestBinding: jest.fn(),
}));

describe('OrganizationBindingView', () => {
  let queryClient;

  const organization = {
    id: 7,
    name: 'test-org-01',
    phone: '+1 555 0000',
    email: 'org@example.org',
    location: 'Sierra Leone',
  };

  function renderView() {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{ orgList: [organization] }}>
            <OrganizationBindingView />
          </AppContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  async function chooseOrganization() {
    const select = await screen.findByTestId('binding-organization');
    userEvent.click(within(select).getByRole('button'));
    userEvent.click(await screen.findByText('test-org-01'));
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    getMyBinding.mockResolvedValue(null);
    requestBinding.mockResolvedValue({
      organizationId: 7,
      status: 'pending',
      proposed: {},
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('prefills the organization fields and sends only what changed', async () => {
    renderView();
    await chooseOrganization();

    const phone = await screen.findByLabelText('Phone');
    expect(phone).toHaveValue('+1 555 0000');
    expect(screen.getByLabelText('Email')).toHaveValue('org@example.org');

    userEvent.clear(phone);
    userEvent.type(phone, '+254 700 123456');
    userEvent.click(screen.getByTestId('binding-submit'));

    await waitFor(() =>
      expect(requestBinding).toHaveBeenCalledWith(7, {
        phone: '+254 700 123456',
      })
    );
  });

  it('sends nothing extra when no field is touched', async () => {
    renderView();
    await chooseOrganization();

    userEvent.click(await screen.findByTestId('binding-submit'));

    await waitFor(() => expect(requestBinding).toHaveBeenCalledWith(7, {}));
  });

  it('blocks a request that proposes an invalid phone', async () => {
    renderView();
    await chooseOrganization();

    const phone = await screen.findByLabelText('Phone');
    userEvent.clear(phone);
    userEvent.type(phone, '123');
    userEvent.click(screen.getByTestId('binding-submit'));

    expect(
      await screen.findByText('Enter a valid phone number')
    ).toBeInTheDocument();
    expect(requestBinding).not.toHaveBeenCalled();
  });
});
