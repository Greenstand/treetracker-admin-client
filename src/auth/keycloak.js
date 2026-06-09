import Keycloak from 'keycloak-js';
import { session } from '../models/auth';

/** @typedef {import('keycloak-js').KeycloakConfig} KeycloakConfig */
/** @typedef {import('keycloak-js').KeycloakInitOptions} KeycloakInitOptions */
/** @typedef {import('keycloak-js').KeycloakInstance} KeycloakInstance */

/** @type {KeycloakConfig} */
const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
};

/** @type {KeycloakInstance | undefined} */
let keycloak;
/** @type {Promise<boolean> | undefined} */
let keycloakInitPromise;
/** @type {Promise<string | undefined> | undefined} */
let keycloakRefreshPromise;
/** @type {{ status: 'success'|'cancelled'|'error', action: string|undefined }|undefined} */
let pendingActionUpdate;

const PENDING_ACTION_STORAGE_KEY = 'pendingKeycloakAction';

function readPendingActionFromStorage() {
  try {
    return sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function clearPendingActionFromStorage() {
  try {
    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
  } catch {
    /* sessionStorage unavailable — nothing to clean up */
  }
}

export function isKeycloakConfigured() {
  return Boolean(
    keycloakConfig.url && keycloakConfig.realm && keycloakConfig.clientId
  );
}

function getKeycloak() {
  if (!isKeycloakConfigured()) {
    return undefined;
  }

  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig);
    // in keyclok version 26 we get value for action as well
    // if we upgrade to v 26 in future then we dont need the
    // eadPendingActionFromStorage hack
    keycloak.onActionUpdate = (status, action) => {
      console.log('on action update', status, action);
      pendingActionUpdate = { status, action };
    };
  }

  return keycloak;
}

export function consumeKeycloakActionUpdate() {
  const update = pendingActionUpdate;
  pendingActionUpdate = undefined;

  const fallbackAction = readPendingActionFromStorage();
  clearPendingActionFromStorage();

  if (!update) return undefined;

  return {
    status: update.status,
    action: update.action || fallbackAction,
  };
}

export async function initializeKeycloak() {
  const instance = getKeycloak();

  if (!instance) {
    return false;
  }

  if (keycloakInitPromise) {
    return keycloakInitPromise;
  }

  /** @type {KeycloakInitOptions} */
  const initOptions = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  };

  keycloakInitPromise = instance.init(initOptions).catch((error) => {
    keycloakInitPromise = undefined;
    throw error;
  });

  return keycloakInitPromise;
}

export async function getBootstrapAuthState() {
  const instance = getKeycloak();

  if (!instance) {
    return { authenticated: false, token: undefined, user: undefined };
  }

  const authenticated = await initializeKeycloak();
  if (!authenticated || !instance.token) {
    return { authenticated: false, token: undefined, user: undefined };
  }

  return {
    authenticated: true,
    token: `Bearer ${instance.token}`,
    user: getUserFromToken(),
  };
}

export async function loginToKeycloak(redirectPath = '/') {
  const instance = getKeycloak();

  if (!instance) {
    return false;
  }

  const authenticated = await initializeKeycloak();
  if (authenticated) {
    return true;
  }

  await instance.login({
    redirectUri: `${window.location.origin}${redirectPath}`,
  });

  return false;
}

export async function startKeycloakRequiredAction(
  action,
  redirectPath = '/account'
) {
  const instance = getKeycloak();

  if (!instance) {
    return false;
  }

  const authenticated = await initializeKeycloak();
  if (!authenticated) {
    return false;
  }

  try {
    sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, action);
  } catch {
    /* sessionStorage unavailable — adapter's onActionUpdate(action) is the
       primary source; we'd just lose the fallback path */
  }

  await instance.login({
    action,
    redirectUri: `${window.location.origin}${redirectPath}`,
  });
}

export function logoutFromKeycloak() {
  const instance = getKeycloak();

  if (!instance) {
    return;
  }

  instance.logout({
    redirectUri: `${window.location.origin}/login`,
  });
}

export function clearAuthState() {
  session.token = undefined;
  session.user = undefined;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getAccessToken() {
  const instance = getKeycloak();
  return instance?.token;
}

export function getUserFromToken() {
  const instance = getKeycloak();
  const tokenParsed = instance?.tokenParsed || {};
  const realmRoles = tokenParsed?.realm_access?.roles || [];
  const clientRoles =
    tokenParsed?.resource_access?.[keycloakConfig.clientId]?.roles || [];

  const roleNames = [...new Set([...realmRoles, ...clientRoles])];
  const organization =
    tokenParsed.organization_id !== undefined
      ? {
          id: Number(tokenParsed.organization_id),
        }
      : undefined;

  const user = {
    id: tokenParsed.sub,
    userName: tokenParsed.preferred_username || tokenParsed.email || '',
    firstName: tokenParsed.given_name || '',
    lastName: tokenParsed.family_name || '',
    email: tokenParsed.email || '',
    roleNames,
    policy: {
      // legacy auth uses policy.policies
      //  policy.policies as the compatibility layer
      policies: roleNames.map((name) => ({ name })),
      organization,
    },
  };

  return user;
}

export async function ensureFreshToken(minValidity = 30) {
  const instance = getKeycloak();

  if (!instance) {
    return undefined;
  }

  await initializeKeycloak();

  if (keycloakRefreshPromise) {
    return keycloakRefreshPromise;
  }

  keycloakRefreshPromise = instance
    .updateToken(minValidity)
    .then(() => instance.token)
    .finally(() => {
      keycloakRefreshPromise = undefined;
    });

  return keycloakRefreshPromise;
}

export const KEYCLOAK_UPDATE_ACTIONS = {
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};
