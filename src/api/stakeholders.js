import { handleResponse, handleError, getOrganizationId } from './apiUtils';
import { session } from '../models/auth';

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

async function fetchJSON(query, options) {
  return fetch(query, options).then(handleResponse).catch(handleError);
}

export default {
  getStakeholders(id, { offset, rowsPerPage, orderBy, order, filter }) {
    const orgId = id || getOrganizationId();
    const filterObj = {
      where: filter,
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      offset,
    };

    let query = `${STAKEHOLDER_API}?filter=${JSON.stringify(filterObj)}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}?filter=${JSON.stringify(filterObj)}`;
    }

    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    };

    return fetchJSON(query, options);
  },

  getUnlinkedStakeholders(id, abortController) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}/links`;

    if (id && orgId && orgId !== id) {
      query = `${STAKEHOLDER_API}/links/${id}/${orgId}`;
    } else if (id || orgId) {
      query = `${STAKEHOLDER_API}/links/${id || orgId}`;
    }

    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      signal: abortController?.signal,
    };

    return fetchJSON(query, options);
  },

  updateLinks(id, stakeholdersData) {
    const orgId = id || getOrganizationId();
    let query = `${STAKEHOLDER_API}/links`;

    if (id && orgId && orgId !== id) {
      query = `${STAKEHOLDER_API}/links/${id}/${orgId}`;
    } else if (id || orgId) {
      query = `${STAKEHOLDER_API}/links/${id || orgId}`;
    }

    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholdersData),
    };

    return fetchJSON(query, options);
  },

  // only need the orgId, the id of the stakeholder is in the stakeholderUpdate
  updateStakeholder(stakeholderUpdate) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderUpdate),
    };

    return fetchJSON(query, options);
  },

  createStakeholder(stakeholderData) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderData),
    };

    return fetchJSON(query, options);
  },
};
