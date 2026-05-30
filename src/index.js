import './init';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'typeface-roboto';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getBootstrapAuthState } from './auth/keycloak';
import { cleanupOidcArtifactsFromUrl } from './auth/util';
import { setupAuthAxiosInterceptors } from './api/httpClient';

const queryClient = new QueryClient();
const EMPTY_AUTH_STATE = {
  authenticated: false,
  token: undefined,
  user: undefined,
};
async function bootstrapAndRender() {
  setupAuthAxiosInterceptors();

  let initialAuth = EMPTY_AUTH_STATE;
  try {
    initialAuth = await getBootstrapAuthState();
  } catch (error) {
    console.error('Failed to bootstrap Keycloak auth state', error);
  }

  cleanupOidcArtifactsFromUrl();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <App initialAuth={initialAuth} />
    </QueryClientProvider>
  );
}

bootstrapAndRender();
