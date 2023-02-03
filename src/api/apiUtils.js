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

export const makeQueryString = (filterObj) => {
  // log.debug('makeQueryString 1 ----->', filterObj);
  const arr = [];
  const whereNulls = [];
  const whereNotNulls = [];
  const whereIns = [];
  for (const key in filterObj) {
    if (
      filterObj[key] !== undefined &&
      filterObj[key] !== null &&
      filterObj[key] !== '' &&
      filterObj[key] !== 'not null'
    ) {
      const value =
        typeof filterObj[key] !== 'string'
          ? JSON.stringify(filterObj[key])
          : filterObj[key];
      arr.push(`${key}=${encodeURIComponent(value)}`);
    }

    if (filterObj[key] === null) {
      whereNulls.push(key);
    }

    // only include these specific values in whereNotNulls array or all the regular filters will be included as well
    if (filterObj[key] === 'not null') {
      whereNotNulls.push(key);
    }

    // ignore filters that are undefined or ''
  }

  if (whereNulls.length) {
    arr.push(`whereNulls=${JSON.stringify(whereNulls)}`);
  }

  if (whereNotNulls.length) {
    arr.push(`whereNotNulls=${JSON.stringify(whereNotNulls)}`);
  }

  if (whereIns.length) {
    arr.push(`whereIns=${JSON.stringify(whereIns)}`);
  }

  // log.debug('makeQueryString 2 ----->', arr);
  return arr.join('&');
};
