import { authAxios } from './httpClient';

const apiUrl = `${process.env.REACT_APP_EARNINGS_ROOT}`;

export default {
  /**
   * @function getEarnings
   * @description Get earnings from the API
   * @returns {Promise}
   */
  async getEarnings(params) {
    return authAxios
      .get(`${apiUrl}/earnings`, { params })
      .then((res) => res.data);
  },

  /**
   * @function patchEarning
   * @description Patch earning from the API
   *
   * @param {object} earning - earning to patch
   * @returns {Promise}
   */
  async patchEarning(earning) {
    return authAxios
      .patch(`${apiUrl}/earnings`, earning)
      .then((res) => res.data);
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

    return authAxios
      .patch(`${apiUrl}/earnings/batch`, formData, {
        headers: {
          accept: 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        throw new Error('Payments Batch Upload Failed!', { cause: error });
      });
  },
};
