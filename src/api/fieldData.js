import { handleResponse, handleError } from './apiUtils';

const log = require('loglevel').getLogger('../api/fieldData');

const SESSION_PAGE_LIMIT = 100;
// GET /session has no grower/wallet filter (see Greenstand/treetracker-field-data#docs),
// so we page through and filter client-side. Cap the scan to keep the grower card responsive;
// https://github.com/Greenstand/treetracker-admin-client/issues/616 tracks adding a proper filter.
const SESSION_SCAN_MAX_PAGES = 20;

export default {
  // The legacy planter API (src/api/growers.js) doesn't expose growerAccountUuid,
  // so growerAccountUuid alone can't reliably join to field_data.session today.
  // Sessions also carry a free-text target_wallet that field teams populate with
  // an email or phone number (see the example queries on
  // https://github.com/Greenstand/treetracker-admin-client/issues/616), so we
  // additionally match on that against the grower's known email/phone.
  async getSessionsForGrower({ growerAccountUuid, email, phone } = {}) {
    if (!growerAccountUuid && !email && !phone) return [];
    try {
      const matches = [];
      let offset = 0;
      let total = Infinity;
      let page = 0;

      while (offset < total && page < SESSION_SCAN_MAX_PAGES) {
        const query = `${process.env.REACT_APP_FIELD_DATA_API_ROOT}/session?limit=${SESSION_PAGE_LIMIT}&offset=${offset}`;
        // eslint-disable-next-line no-await-in-loop
        const { sessions, query: pageQuery } = await fetch(query, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        }).then(handleResponse);

        matches.push(
          ...sessions.filter(
            (session) =>
              (growerAccountUuid &&
                session.grower_account_id === growerAccountUuid) ||
              (email && session.target_wallet === email) ||
              (phone && session.target_wallet === phone)
          )
        );

        total = pageQuery.count;
        offset += SESSION_PAGE_LIMIT;
        page += 1;
      }

      if (offset < total) {
        log.warn(
          `Stopped scanning sessions for grower after ${SESSION_SCAN_MAX_PAGES} pages; ${total} sessions exist in total.`
        );
      }

      return matches;
    } catch (error) {
      handleError(error);
    }
  },

  getDeviceConfiguration(deviceConfigurationId) {
    if (!deviceConfigurationId) return Promise.resolve(null);
    try {
      const query = `${process.env.REACT_APP_FIELD_DATA_API_ROOT}/device-configuration/${deviceConfigurationId}`;
      return fetch(query, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getWalletRegistration(walletRegistrationId) {
    if (!walletRegistrationId) return Promise.resolve(null);
    try {
      const query = `${process.env.REACT_APP_FIELD_DATA_API_ROOT}/wallet-registration/${walletRegistrationId}`;
      return fetch(query, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
};
