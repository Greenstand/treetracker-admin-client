import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

export default {
  getGrower(id) {
    try {
      const growerQuery = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${id}`;

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
      const growerFilter = {
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
          // growerAccountUuid: true,
        },
      };
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter?filter=${JSON.stringify(growerFilter)}`;

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

  getCount({ filter }) {
    try {
      const filterObj = filter.getWhereObj ? filter.getWhereObj() : {};
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/count?where=${JSON.stringify(
        filterObj
      )}`;
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
