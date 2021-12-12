import axios from 'axios';
import { session } from '../models/auth';

const apiUrl = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_EARNINGS_API_MAPPING}`;
const Axios = axios.create({ baseURL: apiUrl });

export default {
  /**
   * @function getEarnings
   * @description Get earnings from the API
   * @returns {Promise}
   */
  async getEarnings(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.get(`earnings`, { params, headers }).then((res) => res.data);
  },
};
