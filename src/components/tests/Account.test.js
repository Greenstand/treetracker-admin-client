import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Account from '../Account';
import { AppContext } from '../../context/AppContext';
import * as keycloak from '../../auth/keycloak';
import notification from '../common/notification';
import { getDateTimeStringLocale } from '../../common/locale';
import { getMyKeycloakUser } from '../../api/keycloakUsers';

jest.mock('../../api/keycloakUsers', () => ({
  getMyKeycloakUser: jest.fn(),
}));

jest.mock('../common/notification', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  '../common/Menu',
  () =>
    function MenuMock() {
      return <div>Menu</div>;
    }
);

const baseUser = {
  userName: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  roleNames: ['super_permission'],
};

function renderAccount({
  isKeycloakEnabled,
  logout = jest.fn(),
  user = baseUser,
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          isKeycloakEnabled,
          user,
          logout,
        }}
      >
        <MemoryRouter>
          <Account />
        </MemoryRouter>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

describe('Account', () => {
  beforeEach(() => {
    notification.mockClear();
    getMyKeycloakUser.mockReset();
    getMyKeycloakUser.mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when Keycloak is enabled', () => {
    it('routes CHANGE through the UPDATE_PASSWORD required action', async () => {
      const spy = jest
        .spyOn(keycloak, 'startKeycloakRequiredAction')
        .mockResolvedValue(true);

      renderAccount({ isKeycloakEnabled: true });

      await userEvent.click(screen.getByRole('button', { name: 'CHANGE' }));

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(
          keycloak.KEYCLOAK_UPDATE_ACTIONS.UPDATE_PASSWORD
        );
      });
    });

    it('routes UPDATE ACCOUNT through the UPDATE_PROFILE required action', async () => {
      const spy = jest
        .spyOn(keycloak, 'startKeycloakRequiredAction')
        .mockResolvedValue(true);

      renderAccount({ isKeycloakEnabled: true });

      await userEvent.click(
        screen.getByRole('button', { name: 'UPDATE ACCOUNT' })
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(
          keycloak.KEYCLOAK_UPDATE_ACTIONS.UPDATE_PROFILE
        );
      });
    });

    it('does not call startKeycloakRequiredAction on mount', () => {
      const spy = jest.spyOn(keycloak, 'startKeycloakRequiredAction');

      renderAccount({ isKeycloakEnabled: true });

      expect(spy).not.toHaveBeenCalled();
    });

    it('renders the UPDATE ACCOUNT button', () => {
      renderAccount({ isKeycloakEnabled: true });

      expect(
        screen.getByRole('button', { name: 'UPDATE ACCOUNT' })
      ).toBeInTheDocument();
    });

    describe('on-mount Keycloak action confirmation', () => {
      it('shows the profile-update toast when the adapter returned a successful UPDATE_PROFILE', () => {
        jest
          .spyOn(keycloak, 'consumeKeycloakActionUpdate')
          .mockReturnValue({ status: 'success', action: 'UPDATE_PROFILE' });

        renderAccount({ isKeycloakEnabled: true });

        expect(notification).toHaveBeenCalledWith(
          'Your account information has been updated.',
          'success',
          5000
        );
      });

      it('shows the password-change toast when the adapter returned a successful UPDATE_PASSWORD', () => {
        jest
          .spyOn(keycloak, 'consumeKeycloakActionUpdate')
          .mockReturnValue({ status: 'success', action: 'UPDATE_PASSWORD' });

        renderAccount({ isKeycloakEnabled: true });

        expect(notification).toHaveBeenCalledWith(
          'Your password has been changed.',
          'success',
          5000
        );
      });

      it('does not show a toast when there is no pending action update', () => {
        jest
          .spyOn(keycloak, 'consumeKeycloakActionUpdate')
          .mockReturnValue(undefined);

        renderAccount({ isKeycloakEnabled: true });

        expect(notification).not.toHaveBeenCalled();
      });

      it('does not show a toast when the action was cancelled', () => {
        jest
          .spyOn(keycloak, 'consumeKeycloakActionUpdate')
          .mockReturnValue({ status: 'cancelled', action: 'UPDATE_PROFILE' });

        renderAccount({ isKeycloakEnabled: true });

        expect(notification).not.toHaveBeenCalled();
      });

      it('does not show a toast when the action is success but unknown to the app', () => {
        jest.spyOn(keycloak, 'consumeKeycloakActionUpdate').mockReturnValue({
          status: 'success',
          action: 'SOME_OTHER_ACTION',
        });

        renderAccount({ isKeycloakEnabled: true });

        expect(notification).not.toHaveBeenCalled();
      });
    });
  });

  describe('when Keycloak is disabled (legacy)', () => {
    it('opens the in-app password dialog and does not call Keycloak helpers', async () => {
      const spy = jest.spyOn(keycloak, 'startKeycloakRequiredAction');

      renderAccount({ isKeycloakEnabled: false });

      await userEvent.click(screen.getByRole('button', { name: 'CHANGE' }));

      expect(
        await screen.findByRole('heading', { name: 'Change Password' })
      ).toBeInTheDocument();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not render the UPDATE ACCOUNT button', () => {
      renderAccount({ isKeycloakEnabled: false });

      expect(
        screen.queryByRole('button', { name: 'UPDATE ACCOUNT' })
      ).not.toBeInTheDocument();
    });
  });

  describe('the Created date', () => {
    const CREATED = Date.UTC(2024, 0, 15, 12, 0, 0);
    // The locale helper emits U+202F before AM/PM; the DOM matcher sees a space.
    const shown = getDateTimeStringLocale(CREATED).replace(/\s/g, ' ');

    it('shows the keycloak creation timestamp', async () => {
      getMyKeycloakUser.mockResolvedValue({ createdTimestamp: CREATED });

      renderAccount({ isKeycloakEnabled: true });

      expect(await screen.findByText(shown)).toBeInTheDocument();
    });

    it('hides the label when no date is available', async () => {
      getMyKeycloakUser.mockResolvedValue({});

      renderAccount({ isKeycloakEnabled: true });

      await waitFor(() => expect(getMyKeycloakUser).toHaveBeenCalled());
      expect(screen.queryByText('Created')).not.toBeInTheDocument();
    });

    it('falls back to the legacy createdAt when keycloak is off', () => {
      renderAccount({
        isKeycloakEnabled: false,
        user: { ...baseUser, createdAt: new Date(CREATED).toISOString() },
      });

      expect(screen.getByText(shown)).toBeInTheDocument();
      expect(getMyKeycloakUser).not.toHaveBeenCalled();
    });
  });
});
