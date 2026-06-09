import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Account from '../Account';
import { AppContext } from '../../context/AppContext';
import * as keycloak from '../../auth/keycloak';

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

    it('does not call startKeycloakRequiredAction on mount', () => {
      const spy = jest.spyOn(keycloak, 'startKeycloakRequiredAction');

      renderAccount({ isKeycloakEnabled: true });

      expect(spy).not.toHaveBeenCalled();
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
  });
});
