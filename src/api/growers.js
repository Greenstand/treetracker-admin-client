import {
  handleResponse,
  handleError,
  getOrganization,
  getOrganizationUUID,
} from './apiUtils';
import { session } from '../models/auth';
import api from './treeTrackerApi';
import log from 'loglevel';

const QUERY_API = process.env.REACT_APP_QUERY_API_ROOT;

export default {
  makeQueryString(filterObj) {
    let arr = [];
    for (const key in filterObj) {
      if ((filterObj[key] || filterObj[key] === 0) && filterObj[key] !== '') {
        arr.push(`${key}=${filterObj[key]}`);
      }
    }

    return arr.join('&');
  },
  getGrower(id) {
    try {
      const growerQuery = `${QUERY_API}/grower-accounts/${id}`;
      // const growerQuery = `${
      //   process.env.REACT_APP_API_ROOT
      // }/api/${getOrganization()}planter/${id}`;

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

  getGrowers({ skip, rowsPerPage, orderBy = 'id', order = 'desc', filter }) {
    try {
      const where = filter.getWhereObj ? filter.getWhereObj() : {};
      where.organizationId = getOrganizationUUID();
      const growerFilter = {
        ...where,
        // orderBy,
        // order,
        limit: rowsPerPage,
        // skip,
      };
      const query = `${QUERY_API}/grower-accounts${
        growerFilter ? `?${api.makeQueryString(growerFilter)}` : ''
      }`;
      // const query = `${QUERY_API}/api/${getOrganization()}planter?filter=${JSON.stringify(
      //   growerFilter
      // )}`;

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

  getGrowerRegistrations(growerId) {
    try {
      // const registrationQuery = `${QUERY_API}/planter-registration?filter[where][planterId]=${growerId}`;
      const registrationQuery = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter-registration?filter[where][planterId]=${growerId}`;
      return fetch(registrationQuery, {
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

  getGrowerSelfies(growerId) {
    try {
      const filter = {
        order: 'timeUpdated DESC',
        limit: 100,
        fields: ['planterPhotoUrl'],
      };

      const growerSelfiesQuery = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${growerId}/selfies/?filter=${JSON.stringify(
        filter
      )}`;

      return fetch(growerSelfiesQuery, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      })
        .then(handleResponse)
        .then((items) => {
          // Remove duplicates
          return [
            ...new Set(
              items
                .map((tree) => tree.planterPhotoUrl)
                .filter((img) => img !== '')
            ),
          ];
        });
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
      const growerQuery = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${id}`;

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
