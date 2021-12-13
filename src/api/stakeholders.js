import {
  handleResponse,
  handleError,
  // getOrganization,
  getOrganizationId,
} from './apiUtils';
import { session } from '../models/auth';

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

export default {
  getStakeholders(id, { offset, rowsPerPage, orderBy, order, filter }) {
    const orgId = getOrganizationId();
    const where = filter.getWhereObj();
    const lbFilter = {
      where,
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      offset,
      fields: {
        id: true,
        type: true,
        orgName: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        website: true,
        logoUrl: true,
        imageUrl: true,
        map: true,
        stakeholder_uuid: true,
      },
    };

    let query = '';
    if (!id && orgId && Number(orgId)) {
      query = `${STAKEHOLDER_API}/${orgId}?filter=${JSON.stringify(lbFilter)}`;
    } else if (id) {
      query = `${STAKEHOLDER_API}/${id}?filter=${JSON.stringify(lbFilter)}`;
    } else {
      query = `${STAKEHOLDER_API}?filter=${JSON.stringify(lbFilter)}`;
    }

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

    console.log('id orgId', id, orgId);

    let query = '';
    if (!id && orgId && Number(orgId)) {
      query = `${STAKEHOLDER_API}/links/${orgId}`;
    } else if (id) {
      query = `${STAKEHOLDER_API}/links/${id}`;
    } else {
      query = `${STAKEHOLDER_API}/links`;
    }

    console.log('getUnlinkedStakeholders ---->', query);

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
    const orgId = getOrganizationId();

    let query = '';
    if (orgId && Number(orgId)) {
      query = `${STAKEHOLDER_API}/links/${orgId}`;
    } else if (id) {
      query = `${STAKEHOLDER_API}/links/${id}`;
    } else {
      query = `${STAKEHOLDER_API}/links`;
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

  updateStakeholder(stakeholderUpdate) {
    const orgId = getOrganizationId();
    const query = `${STAKEHOLDER_API}/${orgId()}`;

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
    console.log('org ---> ', getOrganizationId());
    let query = `${STAKEHOLDER_API}`;
    const orgId = getOrganizationId();

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
