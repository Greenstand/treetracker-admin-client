import { session } from '../models/auth';
const log = require('loglevel');

export async function handleResponse(response) {
  if (response.status === 204) return {};
  if (response.ok) return response.json();

  // server-side validation error occurred.
  const error = await response.json();
  log.debug('handleResponse error ---', response.status, error);

  if (response.status === 422) {
    return {
      error: true,
      message: error.message,
    };
  }
  if (response.status === 400) {
    throw new Error(error);
  }
  throw new Error('Network response was not ok.');
}

// we should call an error logging service, but
export function handleError(error) {
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
