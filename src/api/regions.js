import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

const convertPayload = (payload) => {
  return {
    calculate_statistics:
      payload.calculateStatistics || payload.calculate_statistics,
    id: payload.id,
    name: payload.name,
    shape: payload.shape,
    show_on_org_map: payload.showOnOrgMap || payload.show_on_org_map,
    updated_at: payload.updatedAt || payload.updated_at,
    owner_id: payload.ownerId || payload.owner_id,
    region_name_property:
      payload.regionNameProperty || payload.region_name_property,
    collection_name: payload.collectionName || payload.collection_name,
  };
};

export default {
  getItem(type, id) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;

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

  getRegion(id) {
    return this.getItem('region', id);
  },

  getCollection(id) {
    return this.getItem('collection', id);
  },

  getItems(
    type,
    {
      skip,
      rowsPerPage,
      filter,
      // orderBy = 'id',
      // order = 'desc',
    }
  ) {
    const params = new URLSearchParams({
      ...filter,
      limit: rowsPerPage,
      offset: skip,
      // sort: [`${orderBy}`, `${order}`],
    });
    const query = `${
      process.env.REACT_APP_REGION_API_ROOT
    }/${type}?${params.toString()}`;

    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getRegions(params) {
    return this.getItems('region', params);
  },

  getCollections(params) {
    return this.getItems('collection', params);
  },

  upload(payload) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/upload`;
    return fetch(query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(convertPayload(payload)),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateitem(type, id, payload) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;
    return fetch(query, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(
        convertPayload({
          ...payload,
          id: undefined,
        })
      ),
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateRegion(id, payload) {
    return this.updateitem('region', id, payload);
  },

  updateCollection(id, payload) {
    return this.updateitem('collection', id, payload);
  },

  deleteItem(type, id) {
    const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;
    return fetch(query, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  deleteRegion(id) {
    return this.deleteItem('region', id);
  },

  deleteCollection(id) {
    return this.deleteItem('collection', id);
  },
};
