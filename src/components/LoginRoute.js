import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import Login from './Login';
import { AppContext } from '../context/AppContext';
import { loginToKeycloak } from '../auth/keycloak';

export default function LoginRoute() {
  const appContext = useContext(AppContext);
  const location = useLocation();
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    if (!appContext.isKeycloakEnabled || appContext.user) {
      redirectAttemptedRef.current = false;
      return;
    }

    if (appContext.authStatus !== 'unauthenticated') {
      return;
    }

    if (redirectAttemptedRef.current) {
      return;
    }

    redirectAttemptedRef.current = true;

    const pathname =
      location?.state?.from?.pathname &&
      location.state.from.pathname !== '/login' &&
      location.state.from.pathname !== '/auth/callback'
        ? location.state.from.pathname
        : '/';
    const search = location?.state?.from?.search || '';
    const hash = location?.state?.from?.hash || '';
    const redirectPath = `${pathname}${search}${hash}`;
    sessionStorage.setItem('post_login_path', redirectPath);

    Promise.resolve(loginToKeycloak('/auth/callback')).catch((error) => {
      console.error('Keycloak login redirect failed', error);
      redirectAttemptedRef.current = false;
    });
  }, [
    appContext.authStatus,
    appContext.isKeycloakEnabled,
    appContext.user,
    location,
  ]);

  if (appContext.user) {
    const from = location?.state?.from || { pathname: '/' };
    return <Redirect to={from} />;
  }

  return <Login />;
}
