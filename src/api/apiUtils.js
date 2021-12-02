import { session } from '../models/auth';

export async function handleResponse(response) {
  if (response.status === 204) return {};
  if (response.ok) return response.json();
  if (response.status === 400) {
    // server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error('Network response was not ok.');
}

// we should call an error logging service, but
export function handleError(error) {
  if (error.name === 'AbortError') {
    // Ignore `AbortError`
    console.log('Aborted', error);
  } else {
    console.error('API call failed. ' + error);
    throw error;
  }
}

// used for limiting organization access, NOT filtering by org/sub-orgs
export function getOrganization() {
  if (session.user?.policy?.organization?.id) {
    return `organization/${session.user?.policy?.organization?.id}/`;
  } else {
    return '';
  }
}

export function getOrganizationId() {
  if (session.user?.policy?.organization?.id) {
    return session.user?.policy?.organization?.id;
  } else {
    return null;
  }
}
