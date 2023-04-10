import { handleResponse, handleError, makeQueryString } from './apiUtils';
import { session } from '../models/auth';
// import log from 'loglevel';

const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;
const QUERY_API = process.env.REACT_APP_QUERY_API_ROOT;

export default {
  // query legacy api
  getGrower(id) {
    try {
      const growerQuery = `${QUERY_API}/v2/growers/${id}`;

      return fetch(growerQuery, {
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
  // query new microservice
  getGrowers({ skip, rowsPerPage, filter }, abortController) {
    try {
      const where = filter.getWhereObj ? filter.getWhereObj() : {};
      const growerFilter = {
        ...where,
        limit: rowsPerPage,
        offset: skip,
      };

      const query = `${QUERY_API}/v2/growers${
        growerFilter ? `?${makeQueryString(growerFilter)}` : ''
      }`;

      return fetch(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getCount(filter) {
    try {
      const filterObj = filter?.getWhereObj ? filter.getWhereObj() : {};
      const query = `${QUERY_API}/v2/growers/count${
        filterObj ? `?${makeQueryString(filterObj)}` : ''
      }`;
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

  getGrowerSelfies(growerId) {
    try {
      const growerSelfiesQuery = `${QUERY_API}/v2/growers/${growerId}/selfies`;

      return fetch(growerSelfiesQuery, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      })
        .then(handleResponse)
        .then((items) => items?.selfies?.filter((img) => img !== ''));
    } catch (error) {
      handleError(error);
    }
  },

  updateGrower(growerUpdate) {
    try {
      if (growerUpdate.organizationId === 'null') {
        growerUpdate = { ...growerUpdate, organizationId: null };
      }
      const { id } = growerUpdate;
      const growerQuery = `${TREETRACKER_API}/grower_accounts/${id}`;

      let newBody = Object.assign({}, growerUpdate);
      delete newBody.id;
      return fetch(growerQuery, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(newBody),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getWallets({ skip, rowsPerPage, filter }) {
    try {
      const where = filter.getWhereObj ? filter.getWhereObj() : {};
      const growerFilter = {
        ...where,
        limit: rowsPerPage,
        offset: skip,
      };

      const query = `${QUERY_API}/v2/growers/wallets${
        growerFilter ? `?${makeQueryString(growerFilter)}` : ''
      }`;

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
};
