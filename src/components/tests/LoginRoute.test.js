import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import LoginRoute from '../LoginRoute';
import { AppContext } from '../../context/AppContext';
import * as keycloak from '../../auth/keycloak';

jest.mock(
  '../Login',
  () =>
    function LoginMock() {
      return <div>Login</div>;
    }
);

describe('LoginRoute', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.spyOn(keycloak, 'loginToKeycloak').mockResolvedValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stores post login path and redirects to keycloak callback', async () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/login',
          state: {
            from: {
              pathname: '/captures',
              search: '?status=open',
              hash: '#section',
            },
          },
        },
      ],
    });

    render(
      <AppContext.Provider
        value={{
          isKeycloakEnabled: true,
          user: undefined,
          authStatus: 'unauthenticated',
        }}
      >
        <Router history={history}>
          <LoginRoute />
        </Router>
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(keycloak.loginToKeycloak).toHaveBeenCalledWith('/auth/callback');
    });

    expect(sessionStorage.getItem('post_login_path')).toBe(
      '/captures?status=open#section'
    );
  });
});
