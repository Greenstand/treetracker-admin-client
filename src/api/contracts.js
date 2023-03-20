import axios from 'axios';
import { session } from '../models/auth';

const apiUrl = `${process.env.REACT_APP_CONTRACTS_ROOT}`;
const Axios = axios.create({ baseURL: apiUrl });

export default {
  /**
   * @function getContracts
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async getContracts(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.get(`contract`, { params, headers }).then((res) => res.data);
  },

  /**
   * @function createContract
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async createContract(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.post(`contract`, { params, headers }).then((res) => res.data);
  },

  /**
   * @function patchEarning
   * @description Patch earning from the API
   *
   * @param {object} earning - earning to patch
   * @returns {Promise}
   */
  async patchContract(contract) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.patch(`contracts`, contract, { headers }).then(
      (res) => res.data
    );
  },

  /**
   * @funtion batchPatchContracts
   * @description Batch patch Contracts
   * @param {File} csv file
   * @returns {Promise}
   * */
  async batchPatchContracts(file) {
    const formData = new FormData();
    formData.append('csv', file);
    const headers = {
      accept: 'multipart/form-data',
      Authorization: session.token,
    };

    return Axios.patch(`contracts/batch`, formData, { headers })
      .then((res) => res.data)
      .catch((error) => {
        throw new Error('Contracts Batch Upload Failed!', { cause: error });
      });
  },
};
