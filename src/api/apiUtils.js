import { session } from '../models/auth';
import { getUserFromToken, isKeycloakConfigured } from '../auth/keycloak';
const log = require('loglevel');

export async function handleResponse(response) {
  if (response.status === 204) return {};
  const payload = await response.json();
  if (response.ok) return payload;

  log.debug('handleResponse error ---', response.status, payload);

  // pass along user errors
  return Promise.reject({
    status: response.status,
    message: payload.error,
  });
}

// we should call an error logging service, but
export function handleError(error) {
  log.debug('handleError', error);
  if (error.name === 'AbortError') {
    // Ignore `AbortError`
    log.debug('Aborted', error);
  } else {
    log.error('API call failed. ' + error.name, error.message, error);
    throw error;
  }
}

export function getApiErrorMessage(
  error,
  fallbackMessage,
  messagesByCode = {}
) {
  const rawError = error?.response?.data?.error;
  const errorCode = rawError?.code;
  const rawErrorMessage =
    typeof rawError === 'string' ? rawError : rawError?.message;

  return (
    messagesByCode[errorCode] ??
    rawErrorMessage ??
    error?.response?.data?.message ??
    error?.message ??
    fallbackMessage
  );
}

// used for limiting organization access, NOT filtering by org/sub-orgs
// todo move this in compoent itelf
// if og exists then call the endpoint with organization
// else call without it
export function getOrganization() {
  const orgId = getOrganizationId();
  return orgId ? `organization/${orgId}/` : '';
}

function getAuthenticatedUser() {
  if (isKeycloakConfigured()) {
    const keycloakUser = getUserFromToken();

    if (keycloakUser?.id) {
      return keycloakUser;
    }
  }

  return session.user;
}

export function getOrganizationId() {
  return getAuthenticatedUser()?.policy?.organization?.id || null;
}

export function getOrganizationUUID() {
  return getAuthenticatedUser()?.policy?.organization?.uuid || null;
}
