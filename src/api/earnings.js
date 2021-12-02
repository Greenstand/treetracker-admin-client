import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

const apiUrl = `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_EARNINGS_API_MAPPING}`;

export default {
  /**
   * @function getEarnings
   * @description Get earnings from the API
   * @returns {Promise}
   */
  async getEarnings(limit = 20, offset = 0, sortByInfo) {
    const sortField = sortByInfo?.field || 'grower';
    const sortOrder = sortByInfo?.order || 'asc';
    const endpoint = `${apiUrl}earnings?limit=${limit}&offset=${offset}&sort_by=${sortField}&order=${sortOrder}`;
    return fetch(endpoint, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
