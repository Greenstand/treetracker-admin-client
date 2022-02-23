import { session } from '../models/auth';

export async function handleResponse(response) {
  if (response.status === 204) return {};
  if (response.ok) return response.json();

  // server-side validation error occurred.
  // Server side validation returns a string error message, so parse as text instead of json.
  const error = await response.text();
  console.log('handleResponse error ---', error);

  if (response.status === 400) {
    throw new Error(error);
  }
  if (response.status === 500 && error.includes('author')) {
    // server-side error occurred. Author account not found.
    // throw new Error(
    //   "The account wasn't found. Please contact the administrator."
    // );
    response.json({
      error: "The account wasn't found. Please contact the administrator.",
    });
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
  const orgId = getOrganizationId();
  return orgId ? `organization/${orgId}/` : '';
}

export function getOrganizationId() {
  return session.user?.policy?.organization?.id || null;
}
