import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

const convertRegionPayload = (payload) => {
  return {
    calculate_statistics:
      payload.calculateStatistics || payload.calculate_statistics,
    collection_id: payload.collectionId || payload.collection_id,
    created_at: payload.createdAt || payload.created_at,
    id: payload.id,
    name: payload.name,
    properties: payload.properties,
    shape: payload.shape,
    show_on_org_map: payload.showOnOrgMap || payload.show_on_org_map,
    updated_at: payload.updatedAt || payload.updated_at,
    owner_id: payload.ownerId || payload.owner_id,
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
    const regionQuery = new URLSearchParams({
      ...filter,
      // order: [`${orderBy}`, `${order}`],
      limit: rowsPerPage,
      offset: skip,
    });
    const query = `${
      process.env.REACT_APP_REGION_API_ROOT
    }/region?${regionQuery.toString()}`;

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
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/upload`;
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

  createCollection(payload) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/upload`;

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
      body: JSON.stringify(
        convertRegionPayload({
          ...payload,
          id: undefined,
        })
      ),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
