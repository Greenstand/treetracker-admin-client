import { handleResponse, handleError, getOrganizationId } from './apiUtils';
import { session } from '../models/auth';

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

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

    console.log('query', query);

    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getUnlinkedStakeholders(id, abortController) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}/links`;

    // if (orgId) {
    //   query = `${STAKEHOLDER_API}/links/${orgId}`;
    // }

    if (id && orgId && orgId !== id) {
      // pass both ids of the login org and the current stakeholder being viewed
      query = `${STAKEHOLDER_API}/links/${id}/${orgId}`;
    } else if (id || orgId) {
      query = `${STAKEHOLDER_API}/links/${id || orgId}`;
    } else {
      query = `${STAKEHOLDER_API}/links`;
    }

    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateLinks(id, stakeholdersData) {
    const orgId = id || getOrganizationId();
    let query = `${STAKEHOLDER_API}/links`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/links/${orgId}`;
    }

    return fetch(query, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholdersData),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  // only need the orgId, the id of the stakeholder is in the stakeholderUpdate
  updateStakeholder(stakeholderUpdate) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    return fetch(query, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderUpdate),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  createStakeholder(stakeholderData) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderData),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
