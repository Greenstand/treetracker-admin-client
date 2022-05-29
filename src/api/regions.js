import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

export default {
  getItem(type, id) {
    try {
      
      const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getRegion(id) {
    return this.getItem('region', id);
  },

  getCollection(id) {
    return this.getItem('collection', id);
  },

  getItems(
    type,
    { skip, rowsPerPage, filter, orderBy = 'name', order = 'desc' }
  ) {
    try {
      let params = {
        ...filter,
        offset: skip,
        sort_by: orderBy,
        order,
      };
      if (rowsPerPage > 0) {
        params.limit = rowsPerPage;
      }

      const searchParams = new URLSearchParams(params);
      const query = `${
        process.env.REACT_APP_REGION_API_ROOT
      }/${type}?${searchParams.toString()}`;

      return fetch(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getRegions(params) {
    return this.getItems('region', params);
  },

  getCollections(params) {
    return this.getItems('collection', params);
  },

  upload(payload) {
    try {
      const query = `${process.env.REACT_APP_REGION_API_ROOT}/upload`;
      return fetch(query, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(payload),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  updateitem(type, payload, id) {
    try {
      const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;
      return fetch(query, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          ...payload,
          id: undefined,
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  updateRegion(id, payload) {
    return this.updateitem('region', id, payload);
  },

  updateCollection(id, payload) {
    return this.updateitem('collection', id, payload);
  },

  deleteItem(type, id) {
    try {
      const query = `${process.env.REACT_APP_REGION_API_ROOT}/${type}/${id}`;
      return fetch(query, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  deleteRegion(id) {
    return this.deleteItem('region', id);
  },

  deleteCollection(id) {
    return this.deleteItem('collection', id);
  },
};
