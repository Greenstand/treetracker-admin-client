import {
  handleResponse,
  handleError,
  getOrganizationId,
  // getOrganization,
} from './apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/FilterStakeholder';
const log = require('loglevel').getLogger('../api/stakeholders');

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

async function fetchJSON(query, options) {
  return fetch(query, options).then(handleResponse).catch(handleError);
}

function removeEmptyValues(obj) {
  const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  return newObj;
}

export default {
  getStakeholders(id, filter = new FilterModel()) {
    try {
      const orgId = id || getOrganizationId();

      const where = Object.keys(filter).reduce((acc, key) => {
        if (filter[key]) {
          acc += `&${key}=${filter[key]}`;
        }
        return acc;
      }, '');

      let query = `${STAKEHOLDER_API}/stakeholders`;

      if (orgId && where) {
        query += `/${orgId}?${where}`;
      } else if (!orgId && where) {
        query += `/?${where}`;
      } else if (orgId && !where) {
        query += `/${orgId}`;
      }

      const options = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      };

      return fetchJSON(query, options);
    } catch (e) {
      log.error('getStakeholders', e);
    }
  },

  deleteStakeholder(id, stakeholderData) {
    try {
      const orgId = id || getOrganizationId();
      let query = `${STAKEHOLDER_API}/stakeholders`;

      if (id && orgId && orgId !== id) {
        query += `/${id}/${orgId}`;
      } else if (id || orgId) {
        query += `/${id || orgId}`;
      }

      const options = {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(stakeholderData),
      };

      return fetchJSON(query, options);
    } catch (e) {
      log.error('deleteStakeholder', e);
    }
  },

  // only need the orgId, the id of the stakeholder is in the stakeholderUpdate
  updateStakeholder(stakeholderUpdate) {
    try {
      const orgId = getOrganizationId();
      let query = `${STAKEHOLDER_API}/stakeholders`;

      if (orgId) {
        query += `/${orgId}`;
      }

      const updated = removeEmptyValues(stakeholderUpdate);

      const options = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(updated),
      };

      return fetchJSON(query, options);
    } catch (e) {
      log.error('updateStakeholder', e);
    }
  },

  createStakeholder(stakeholderData) {
    try {
      const orgId = getOrganizationId();
      let query = `${STAKEHOLDER_API}/stakeholders`;

      if (orgId) {
        query += `/${orgId}`;
      }

      const created = removeEmptyValues(stakeholderData);

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(created),
      };

      return fetchJSON(query, options);
    } catch (e) {
      log.error('createStakeholder', e);
    }
  },

  // KEEP FOR FUTURE USE

  // async getUnlinkedStakeholders(id, abortController) {
  //   const orgId = getOrganizationId();
  //   let query = `${STAKEHOLDER_API}/stakeholders/relations`;

  //   if (id && orgId && orgId !== id) {
  //     query = `${STAKEHOLDER_API}/stakeholders/relations/${id}?isRelation=${false}&owner_id=${orgId}`;
  //   } else if (id || orgId) {
  //     query = `${STAKEHOLDER_API}/stakeholders/relations/${id || orgId}?isRelation=${false}`;
  //   }

  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'content-type': 'application/json',
  //       Authorization: session.token,
  //     },
  //     signal: abortController?.signal,
  //   };

  //   // return fetchJSON(query, options);
  //   const data = await fetchJSON(query, options);
  //   console.log('data', data);
  //   return data;
  // },

  // createLink(id, stakeholdersData) {
  //   const orgId = id || getOrganizationId();
  //   let query = `${STAKEHOLDER_API}/stakeholders/relations`;

  //   if (id && orgId && orgId !== id) {
  //     query += `/${id}/${orgId}`; //?owner_id=${orgId}`;
  //   } else if (id || orgId) {
  //     query += `/${id || orgId}`;
  //   }

  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json',
  //       Authorization: session.token,
  //     },
  //     body: JSON.stringify(stakeholdersData),
  //   };

  //   return fetchJSON(query, options);
  // },

  // updateLinks(id, stakeholdersData) {
  //   const orgId = id || getOrganizationId();
  //   const { linked } = stakeholdersData;
  //   let query = `${STAKEHOLDER_API}/stakeholders/relations`;

  //   if (id && orgId && orgId !== id) {
  //     query += `/${id}/${orgId}?owner_id=${orgId}`;
  //   } else if (id || orgId) {
  //     query += `/${id || orgId}`;
  //   }

  //   let options;

  //   if (linked) {
  //     options = {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json',
  //         Authorization: session.token,
  //       },
  //       body: JSON.stringify(stakeholdersData),
  //     };
  //   } else {
  //     options = {
  //       method: 'DELETE',
  //       headers: {
  //         'content-type': 'application/json',
  //         Authorization: session.token,
  //       },
  //       body: JSON.stringify(stakeholdersData),
  //     };
  //   }

  //   return fetchJSON(query, options);
  // },
};
