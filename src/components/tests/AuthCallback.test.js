import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AuthCallback from '../AuthCallback';
import { AppContext } from '../../context/AppContext';
import * as keycloak from '../../auth/keycloak';

describe('AuthCallback', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.spyOn(keycloak, 'initializeKeycloak').mockResolvedValue(true);
    jest.spyOn(keycloak, 'getAccessToken').mockReturnValue('kc-token');
    jest.spyOn(keycloak, 'getUserFromToken').mockReturnValue({ id: 'user-1' });
    jest.spyOn(keycloak, 'clearAuthState').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs in and redirects to /', async () => {
    const login = jest.fn();
    const history = createMemoryHistory({
      initialEntries: ['/auth/callback'],
    });

    render(
      <AppContext.Provider
        value={{
          isKeycloakEnabled: true,
          login,
        }}
      >
        <Router history={history}>
          <AuthCallback />
        </Router>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(keycloak.initializeKeycloak).toHaveBeenCalled();
      expect(keycloak.getAccessToken).toHaveBeenCalled();
      expect(keycloak.getUserFromToken).toHaveBeenCalled();
      expect(login).toHaveBeenCalledTimes(1);
    });

    expect(login).toHaveBeenCalledWith(
      { id: 'user-1' },
      'Bearer kc-token',
      true
    );

    expect(history.location.pathname).toBe('/');
  });
});
