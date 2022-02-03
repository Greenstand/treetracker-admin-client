import axios from 'axios';
import { session } from '../models/auth';

const apiUrl = `${process.env.REACT_APP_EARNINGS_ROOT}`;
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

  /**
   * @function patchEarning
   * @description Patch earning from the API
   *
   * @param {object} earning - earning to patch
   * @returns {Promise}
   */
  async patchEarning(earning) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.patch(`earnings`, earning, { headers }).then(
      (res) => res.data
    );
  },

  /**
   * @funtion batchPatchEarnings
   * @description Batch patch earnings
   * @param {File} csv file
   * @returns {Promise}
   * */
  async batchPatchEarnings(file) {
    const formData = new FormData();
    formData.append('csv', file);
    const headers = {
      accept: 'multipart/form-data',
      Authorization: session.token,
    };

    return Axios.patch(`earnings/batch`, formData, { headers })
      .then((res) => res.data)
      .catch((error) => {
        throw new Error('Payments Batch Upload Failed!', { cause: error });
      });
  },
};
