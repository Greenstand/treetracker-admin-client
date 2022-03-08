import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

const convertRegionPayload = (payload) => {
  return {
    calculate_statistics: payload.calculateStatistics,
    collection_id: payload.collectionId,
    created_at: payload.createdAt,
    id: payload.id,
    name: payload.name,
    properties: payload.properties,
    shape: payload.shape,
    show_on_org_map: payload.showOnOrgMap,
    updated_at: payload.updatedAt,
    ...payload,
  };
};

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
      filter,
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
    const query = `${
      process.env.REACT_APP_REGION_API_ROOT
    }/region/count?filter=${JSON.stringify(filter)}`;
    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  createRegion({ ownerId, ...payload }) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/region?owner_id=${ownerId}`;
    return fetch(query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(convertRegionPayload(payload)),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  createCollection({ ownerId, ...payload }) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/collection?owner_id=${ownerId}`;

    console.log(JSON.stringify(payload));
    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(convertRegionPayload(payload)),
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
      body: JSON.stringify(convertRegionPayload(payload)),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
