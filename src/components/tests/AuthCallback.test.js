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

  it('logs in and redirects to saved post login path', async () => {
    const login = jest.fn();
    sessionStorage.setItem('post_login_path', '/verify?foo=bar');
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

    expect(history.location.pathname).toBe('/verify');
    expect(history.location.search).toBe('?foo=bar');
    expect(sessionStorage.getItem('post_login_path')).toBeNull();
  });
});
