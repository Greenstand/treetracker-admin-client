import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

export default {
  getRegion(id) {
    const regionQuery = `${process.env.REACT_APP_REGION_API_ROOT}/region/${id}`;

    return fetch(regionQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getRegions({ skip, rowsPerPage, orderBy = 'id', order = 'desc', filter }) {
    const regionFilter = {
      filter: { ...filter, owner_id: '123e4567-e89b-12d3-a456-426614174000' },
      order: [`${orderBy}`, `${order}`],
      limit: rowsPerPage,
      offset: skip,
    };
    console.log(process.env);
    const query = `${
      process.env.REACT_APP_REGION_API_ROOT
    }/region?options=${JSON.stringify(regionFilter)}`;

    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getRegionsCount(filter) {
    const filterObj = {
      ...filter,
      owner_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const query = `${
      process.env.REACT_APP_REGION_API_ROOT
    }/region/count?filter=${JSON.stringify(filterObj)}`;
    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  createRegion(payload) {
    // const query = `${process.env.REACT_APP_REGION_API_ROOT}/region?ownerId=${getOrganization()}`;
    const query = `localhost:3006/region?ownerId=${getOrganization()}`;
    return fetch(query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  createCollection(payload) {
    // const query = `${
    //   process.env.REACT_APP_REGION_API_ROOT
    // }/collection?ownerId=${getOrganization()}`;
    const query = `http://localhost:3006/collection?ownerId=123e4567-e89b-12d3-a456-426614174000`;

    console.log(JSON.stringify(payload));
    return fetch(query, {
      method: 'POST',
      //   mode: 'no-cors',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateRegion(payload, id) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/region/${id}`;
    return fetch(query, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
