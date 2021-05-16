import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

export default {
  getPlanter(id) {
    const planterQuery = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}planter/${id}`;

    return fetch(planterQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getPlanters({ skip, rowsPerPage, orderBy = 'id', order = 'desc', filter }) {
    const where = filter ? filter.getWhereObj() : {};
    const planterFilter = {
      where: { ...where, active: true },
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip: skip,
      fields: {
        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
        phone: true,
        personId: true,
        organization: true,
        organizationId: true,
        id: true,
      },
    };
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}planter?filter=${JSON.stringify(planterFilter)}`;
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
    const filterObj = filter ? filter.getWhereObj() : {};
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}planter/count?where=${JSON.stringify(filterObj)}`;
    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getPlanterRegistrations(planterId) {
    const registrationQuery = `${process.env.REACT_APP_API_ROOT}/api/planter-registration?filter[where][planterId]=${planterId}`;
    return fetch(registrationQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getPlanterSelfies(planterId) {
    const filter = {
      order: 'timeUpdated DESC',
      limit: 100,
      fields: ['planterPhotoUrl'],
    };

    const planterSelfiesQuery = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}planter/${planterId}/selfies/?filter=${JSON.stringify(
      filter,
    )}`;

    return fetch(planterSelfiesQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .then((items) => {
        // Remove duplicates
        return [...new Set(items.map((tree) => tree.planterPhotoUrl))];
      })
      .catch(handleError);
  },

  updatePlanter(planterUpdate) {
    if (planterUpdate.organizationId === 'null') {
      planterUpdate = { ...planterUpdate, organizationId: null };
    }
    const { id } = planterUpdate;
    const planterQuery = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}planter/${id}`;

    return fetch(planterQuery, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(planterUpdate),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
