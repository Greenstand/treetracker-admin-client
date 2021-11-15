import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

export default {
  getStakeholder(id) {
    const stakeholderQuery = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}stakeholder/${id}`;

    return fetch(stakeholderQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getStakeholders({
    skip,
    rowsPerPage,
    orderBy = 'id',
    order = 'desc',
    filter,
  }) {
    const where = filter.getWhereObj ? filter.getWhereObj() : {};
    const stakeholderFilter = {
      where: { ...where, active: true },
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip,
      fields: {
        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
        phone: true,
        personId: true,
        organization: true,
        organizationId: true,
        imageRotation: true,
        id: true,
      },
    };
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}stakeholder?filter=${JSON.stringify(
      stakeholderFilter,
    )}`;

    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getCount({ filter }) {
    const filterObj = filter.getWhereObj ? filter.getWhereObj() : {};
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}stakeholder/count?where=${JSON.stringify(
      filterObj,
    )}`;
    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateStakeholder(stakeholderUpdate) {
    if (stakeholderUpdate.organizationId === 'null') {
      stakeholderUpdate = { ...stakeholderUpdate, organizationId: null };
    }
    const { id } = stakeholderUpdate;
    const stakeholderQuery = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}stakeholder/${id}`;

    return fetch(stakeholderQuery, {
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
};
