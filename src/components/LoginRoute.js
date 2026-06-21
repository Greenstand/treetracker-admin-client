import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import Login from './Login';
import { AppContext } from '../context/AppContext';
import { loginToKeycloak } from '../auth/keycloak';
import {
  AUTH_CALLBACK_PATH,
  LOGIN_PATH,
  POST_LOGIN_PATH_KEY,
} from '../auth/constants';

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

    //  location.state.from is set by PrivateRoute when it bounces an unauthenticated user to /login —
    //  it carries the original URL they tried to visit.
    //  If that's available, use it. If not (e.g. after a check-sso redirect where state was lost), fall back to what initializeKeycloak() saved in
    //  sessionStorage before the page unloaded. This is the path AuthCallback will navigate to after login succeeds.

    const fromPathname = location?.state?.from?.pathname;
    const hasValidFrom =
      fromPathname &&
      fromPathname !== LOGIN_PATH &&
      fromPathname !== AUTH_CALLBACK_PATH;

    let redirectPath;
    if (hasValidFrom) {
      const search = location.state.from.search || '';
      const hash = location.state.from.hash || '';
      redirectPath = `${fromPathname}${search}${hash}`;
    } else {
      redirectPath = sessionStorage.getItem(POST_LOGIN_PATH_KEY) || '/';
    }
    sessionStorage.setItem(POST_LOGIN_PATH_KEY, redirectPath);

    Promise.resolve(loginToKeycloak(AUTH_CALLBACK_PATH)).catch((error) => {
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
