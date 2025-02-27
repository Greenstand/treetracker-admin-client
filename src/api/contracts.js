import axios from 'axios';
import { session } from '../models/auth';
import { handleResponse, handleError } from './apiUtils';

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

    // EXAMPLE POST
    // {
    //     "agreement_id": "7bf1f932-2474-4211-8a07-a764ca95c80f",
    //     "worker_id": "93a026d2-a511-404f-958c-a0a36892af0f",
    //     "notes": "test contract notes"
    // }

    return Axios.post(`contract`, { params, headers }).then((res) => res.data);
  },

  /**
   * @function getContractAgreements
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async getContractAgreements(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.get(`agreement`, { params, headers }).then((res) => res.data);
  },

  /**
   * @function createContractAgreement
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async createContractAgreement(agreement) {
    const abortController = new AbortController();
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    // EXAMPLE POST
    // {
    //     "type": "grower",
    //     "owner_id": "08c71152-c552-42e7-b094-f510ff44e9cb",
    //     "funder_id":"c558a80a-f319-4c10-95d4-4282ef745b4b",
    //     "consolidation_rule_id": "6ff67c3a-e588-40e3-ba86-0df623ec6435",
    //     "name": "test agreement",
    //     "species_agreement_id": "e14b78c8-8f71-4c42-bb86-5a7f71996336"
    // }

    try {
      const query = `${apiUrl}/agreement`;

      const result = await fetch(query, {
        method: 'POST',
        headers,
        body: JSON.stringify(agreement),
        signal: abortController?.signal,
      }).then(handleResponse);

      console.log('result ----', result);
      return result;
    } catch (error) {
      handleError(error);
    }

    // const result = await Axios.post(`/agreement`, {
    //   body: JSON.stringify(params),
    //   headers,
    // }).then((res) => res.data);
  },

  /**
   * @function patchContractAgreement
   * @description Patch earning from the API
   *
   * @param {object} earning - earning to patch
   * @returns {Promise}
   */
  async patchContractAgreement(contract) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    return Axios.patch(`/agreement`, contract, { headers }).then(
      (res) => res.data
    );
  },

  /**
   * @function createConsolidationRule
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async createConsolidationRule(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    // EXAMPLE POST
    // {
    //     "name": "test",
    //     "owner_id": "af7c1fe6-d669-414e-b066-e9733f0de7a8",
    //     "lambda": "something"
    // }

    return Axios.post(`contract/consolidation_rule`, { params, headers }).then(
      (res) => res.data
    );
  },

  /**
   * @function createSpeciesAgreement
   * @description Get Contracts from the API
   * @returns {Promise}
   */
  async createSpeciesAgreement(params) {
    const headers = {
      'content-type': 'application/json',
      Authorization: session.token,
    };

    // EXAMPLE POST
    // {
    //     "name": "test species agreement",
    //     "owner_id": "af7c1fe6-d669-414e-b066-e9733f0de7a8",
    //     "description": "test species agreement description"
    // }

    return Axios.post(`contract/species_agreement`, { params, headers }).then(
      (res) => res.data
    );
  },
};
