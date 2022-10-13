import { session } from '../models/auth';
const log = require('loglevel');

export async function handleResponse(response) {
  if (response.status === 204) return {};
  const payload = await response.json();

  if (response.ok) return payload;

  // pass along user errors
  return Promise.reject({
    status: response.status,
    message: payload.error || payload.message,
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

// used for limiting organization access, NOT filtering by org/sub-orgs
export function getOrganization() {
  const orgId = getOrganizationId();
  return orgId ? `organization/${orgId}/` : '';
}

export function getOrganizationId() {
  return session.user?.policy?.organization?.id || null;
}

export function getOrganizationUUID() {
  return session.user?.policy?.organization?.uuid || null;
}
