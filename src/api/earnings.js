import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

const apiUrl = `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_EARNINGS_API_MAPPING}`;

export default {
  /**
   * @function getEarnings
   * @description Get earnings from the API
   * @returns {Promise}
   */
  async getEarnings() {
    const endpoint = `${apiUrl}earnings`;
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
