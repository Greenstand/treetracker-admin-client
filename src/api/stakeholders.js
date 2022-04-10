import { handleResponse, handleError, getOrganizationId } from './apiUtils';
import { session } from '../models/auth';
const log = require('loglevel').getLogger('../api/stakeholders');

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

async function fetchJSON(query, options) {
  return fetch(query, options).then(handleResponse).catch(handleError);
}

export default {
  getStakeholders(id, { filter }) {
    const orgId = id || getOrganizationId();

    const where = Object.keys(filter).reduce((acc, key) => {
      if (filter[key] !== '') {
        acc[key] = filter[key];
      }
      return acc;
    }, {});
    const filterObj = { where };

    let query = `${STAKEHOLDER_API}?filter=${JSON.stringify(filterObj)}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}?filter=${JSON.stringify(filterObj)}`;
    }

    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    };

    return fetchJSON(query, options);
  },

  deleteStakeholder(id, stakeholdersData) {
    const orgId = id || getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

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
      body: JSON.stringify(stakeholdersData),
    };

    return fetchJSON(query, options);
  },

  // only need the orgId, the id of the stakeholder is in the stakeholderUpdate
  updateStakeholder(stakeholderUpdate) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    log.debug('updateStakeholder', query);

    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderUpdate),
    };

    return fetchJSON(query, options);
  },

  createStakeholder(stakeholderData) {
    const orgId = getOrganizationId();
    let query = `${STAKEHOLDER_API}`;

    if (orgId) {
      query = `${STAKEHOLDER_API}/${orgId}`;
    }

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderData),
    };

    return fetchJSON(query, options);
  },

  // KEEP FOR FUTURE USE

  // async getUnlinkedStakeholders(id, abortController) {
  //   const orgId = getOrganizationId();
  //   let query = `${STAKEHOLDER_API}/relations`;

  //   if (id && orgId && orgId !== id) {
  //     query = `${STAKEHOLDER_API}/relations/${id}?isRelation=${false}&owner_id=${orgId}`;
  //   } else if (id || orgId) {
  //     query = `${STAKEHOLDER_API}/relations/${id || orgId}?isRelation=${false}`;
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
  //   let query = `${STAKEHOLDER_API}/relations`;

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
  //   let query = `${STAKEHOLDER_API}/relations`;

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
