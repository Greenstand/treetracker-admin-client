import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Account from '../Account';
import { AppContext } from '../../context/AppContext';
import * as keycloak from '../../auth/keycloak';
import notification from '../common/notification';

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

function renderAccount({ isKeycloakEnabled, logout = jest.fn() } = {}) {
  return render(
    <AppContext.Provider
      value={{
        isKeycloakEnabled,
        user: baseUser,
        logout,
      }}
    >
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    </AppContext.Provider>
  );
}

describe('Account', () => {
  beforeEach(() => {
    notification.mockClear();
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
});
