import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';
import log from 'loglevel';

const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_API_ROOT;
const QUERY_API = process.env.REACT_APP_QUERY_API_ROOT;

export default {
  makeQueryString(filterObj) {
    log.debug('makeQueryString 1 ----->', filterObj);
    const arr = [];
    const whereNulls = [];
    const whereNotNulls = [];
    const whereIns = [];
    for (const key in filterObj) {
      if (
        filterObj[key] !== undefined &&
        filterObj[key] !== null &&
        filterObj[key] !== ''
      ) {
        const value =
          typeof filterObj[key] !== 'string'
            ? JSON.stringify(filterObj[key])
            : filterObj[key];
        arr.push(`${key}=${encodeURIComponent(value)}`);
      }

      if (filterObj[key] === null) {
        whereNulls.push(key);
      }

      // only include these specific values in whereNotNulls array or all the regular filters will be included as well
      if (filterObj[key] === 'not null' || filterObj[key] === 'any') {
        whereNotNulls.push(key);
      }

      // ignore filters that are undefined or ''
    }

    if (whereNulls.length) {
      arr.push(`whereNulls=${JSON.stringify(whereNulls)}`);
    }

    if (whereNotNulls.length) {
      arr.push(`whereNotNulls=${JSON.stringify(whereNotNulls)}`);
    }

    if (whereIns.length) {
      arr.push(`whereIns=${JSON.stringify(whereIns)}`);
    }

    log.debug('makeQueryString 2 ----->', arr);
    return arr.join('&');
  },
  // query legacy api
  getGrower(id) {
    try {
      const growerQuery = `${QUERY_API}/grower-accounts/${id}`;

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
      console.log('getGrowers', filter, growerFilter);

      const query = `${QUERY_API}/grower-accounts?${this.makeQueryString(
        growerFilter
      )}`;

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
      const query = `${QUERY_API}/grower-accounts/count${
        filterObj ? `?${this.makeQueryString(filterObj)}` : ''
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
      const growerSelfiesQuery = `${QUERY_API}/grower-accounts/${growerId}/selfies`;

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
      const growerQuery = `${FIELD_DATA_API}/grower-accounts/${id}`;

      return fetch(growerQuery, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(growerUpdate),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
};
