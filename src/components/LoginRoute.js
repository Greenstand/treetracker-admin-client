import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import Login from './Login';
import { AppContext } from '../context/AppContext';
import { loginToKeycloak } from '../auth/keycloak';
import { LOGIN_PATH } from '../auth/constants';

function useKeycloakLoginRedirect() {
  const { authStatus, isKeycloakEnabled, user } = useContext(AppContext);
  const location = useLocation();
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    if (!isKeycloakEnabled || user) {
      redirectAttemptedRef.current = false;
      return;
    }

    if (authStatus !== 'unauthenticated') {
      return;
    }

    if (redirectAttemptedRef.current) {
      return;
    }

    redirectAttemptedRef.current = true;

    const fromPathname = location?.state?.from?.pathname;
    const hasValidFrom = fromPathname && fromPathname !== LOGIN_PATH;

    let redirectPath;
    if (hasValidFrom) {
      const search = location.state.from.search || '';
      const hash = location.state.from.hash || '';
      redirectPath = `${fromPathname}${search}${hash}`;
    } else {
      redirectPath = '/';
    }

    Promise.resolve(loginToKeycloak(redirectPath)).catch((error) => {
      console.error('Keycloak login redirect failed', error);
      redirectAttemptedRef.current = false;
    });
  }, [authStatus, isKeycloakEnabled, user, location]);
}

export default function LoginRoute() {
  const appContext = useContext(AppContext);
  const location = useLocation();

  useKeycloakLoginRedirect();

  if (appContext.user) {
    const from = location?.state?.from || { pathname: '/' };
    return <Redirect to={from} />;
  }

  return <Login />;
}
