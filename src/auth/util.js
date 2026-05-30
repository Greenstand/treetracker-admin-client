import { session } from '../models/auth';

export const OIDC_CALLBACK_KEYS = [
  'code',
  'state',
  'session_state',
  'iss',
  'error',
  'error_description',
];

export function hasOidcArtifactsInHash(hash) {
  if (!hash || hash === '#') {
    return false;
  }

  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return OIDC_CALLBACK_KEYS.some((key) => params.has(key));
}

export function cleanupOidcArtifactsFromUrl() {
  const url = new URL(window.location.href);
  const hasQueryArtifacts = OIDC_CALLBACK_KEYS.some((key) =>
    url.searchParams.has(key)
  );
  const hasHashArtifacts = hasOidcArtifactsInHash(url.hash);

  if (!hasQueryArtifacts && !hasHashArtifacts) {
    return;
  }

  OIDC_CALLBACK_KEYS.forEach((key) => url.searchParams.delete(key));

  if (hasHashArtifacts) {
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
    OIDC_CALLBACK_KEYS.forEach((key) => hashParams.delete(key));
    const cleanHash = hashParams.toString();
    url.hash = cleanHash ? `#${cleanHash}` : '';
  }

  const cleanSearch = url.searchParams.toString();
  const cleanUrl = `${url.pathname}${cleanSearch ? `?${cleanSearch}` : ''}${
    url.hash
  }`;
  window.history.replaceState({}, document.title, cleanUrl);
}

export function parseStoredUser() {
  const value = localStorage.getItem('user');
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return undefined;
  }
}

export function parseStoredToken() {
  const value = localStorage.getItem('token');
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return value;
  }
}

export function getLegacyToken() {
  if (session?.token) {
    return session.token;
  }

  return parseStoredToken();
}
