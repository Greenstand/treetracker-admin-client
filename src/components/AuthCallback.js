import React, { useContext, useEffect } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  clearAuthState,
  getAccessToken,
  getUserFromToken,
  initializeKeycloak,
} from '../auth/keycloak';
import { LOGIN_PATH, POST_LOGIN_PATH_KEY } from '../auth/constants';

export default function AuthCallback() {
  const appContext = useContext(AppContext);
  const { isKeycloakEnabled, login } = appContext;
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    async function processCallback() {
      if (!isKeycloakEnabled) {
        history.replace(LOGIN_PATH);
        return;
      }

      try {
        // initializeKeycloak() is idempotent — if it already ran (e.g. during
        // the bootstrap in index.js), it returns the cached promise. When this
        // component mounts at /auth/callback Keycloak has just redirected back
        // with an auth code, so the adapter exchanges the code for tokens here.
        const authenticated = await initializeKeycloak();

        if (!isMounted) {
          return;
        }

        // No valid session after the code exchange — wipe any stale state and
        // send the user back to the login page to try again.
        const accessToken = getAccessToken();
        if (!authenticated || !accessToken) {
          clearAuthState();
          history.replace(LOGIN_PATH);
          return;
        }

        // Auth succeeded — persist the user and token into app context.
        const user = getUserFromToken();
        login(user, `Bearer ${accessToken}`, true);

        // Restore the page the user originally tried to visit before auth.
        // The path was saved to sessionStorage either by initializeKeycloak()
        // (before the check-sso redirect unloaded the page) or by LoginRoute
        // (when PrivateRoute bounced them to /login with location.state.from).
        const targetPath = sessionStorage.getItem(POST_LOGIN_PATH_KEY) || '/';
        sessionStorage.removeItem(POST_LOGIN_PATH_KEY);
        history.replace(targetPath);
      } catch (error) {
        // Token exchange or user-info fetch failed — clean up and fall back to login.
        clearAuthState();
        history.replace(LOGIN_PATH);
      }
    }

    processCallback();

    return () => {
      isMounted = false;
    };
  }, [history, isKeycloakEnabled, login]);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress size={24} />
    </Grid>
  );
}
