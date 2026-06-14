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

export default function AuthCallback() {
  const appContext = useContext(AppContext);
  const { isKeycloakEnabled, login } = appContext;
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    async function processCallback() {
      if (!isKeycloakEnabled) {
        history.replace('/login');
        return;
      }

      try {
        const authenticated = await initializeKeycloak();
        if (!isMounted) {
          return;
        }

        const accessToken = getAccessToken();
        if (!authenticated || !accessToken) {
          clearAuthState();
          history.replace('/login');
          return;
        }

        const user = getUserFromToken();
        login(user, `Bearer ${accessToken}`, true);

        const targetPath = sessionStorage.getItem('post_login_path') || '/';
        sessionStorage.removeItem('post_login_path');
        history.replace(targetPath);
      } catch (error) {
        clearAuthState();
        history.replace('/login');
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
