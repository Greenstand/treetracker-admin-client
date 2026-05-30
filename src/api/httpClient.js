import axios from 'axios';
import {
  clearAuthState,
  ensureFreshToken,
  isKeycloakConfigured,
} from '../auth/keycloak';
import { getLegacyToken } from '../auth/util';

export const authAxios = axios.create();
export const publicAxios = axios.create();

let authInterceptorsConfigured = false;

export function setupAuthAxiosInterceptors() {
  if (authInterceptorsConfigured) {
    return;
  }

  authInterceptorsConfigured = true;

  authAxios.interceptors.request.use(async (config) => {
    const headers = config.headers || {};
    if (headers.Authorization) {
      config.headers = headers;
      return config;
    }

    if (!isKeycloakConfigured()) {
      const legacyToken = getLegacyToken();
      if (legacyToken) {
        headers.Authorization = legacyToken;
      }
      config.headers = headers;
      return config;
    }

    try {
      const token = await ensureFreshToken(30);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      config.headers = headers;
      return config;
    } catch (error) {
      clearAuthState();
      window.location.assign('/login');
      return Promise.reject(error);
    }
  });
}
