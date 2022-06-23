import {
  handleResponse,
  handleError,
  getOrganization,
  // getOrganizationUUID,
} from './apiUtils';
import { session } from '../models/auth';
import log from 'loglevel';

// Set API as a variable
const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;
const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_ROOT;
const API_ROOT = process.env.REACT_APP_API_ROOT;

// function makeQueryString(filterObj) {
//   let arr = [];
//   for (const key in filterObj) {
//     if ((filterObj[key] || filterObj[key] === 0) && filterObj[key] !== '') {
//       arr.push(`${key}=${filterObj[key]}`);
//     }
//   }

//   return arr.join('&');
// }

export default {
  makeQueryString(filterObj) {
    let arr = [];
    for (const key in filterObj) {
      if ((filterObj[key] || filterObj[key] === 0) && filterObj[key] !== '') {
        arr.push(`${key}=${filterObj[key]}`);
      }
    }

    return arr.join('&');
  },
  /**
   * Verify Tool
   */
  getRawCaptures(
    {
      page = 0,
      rowsPerPage,
      // TODO: need to be implemented with field data API
      // orderBy = 'captured_at',
      // order = 'desc',
      filter,
    },
    abortController
  ) {
    try {
      const where = filter.getWhereObj();
      log.debug('loadCaptureImages filter -->', filter);
      // const id = getOrganizationUUID();
      const filterObj = {
        ...where,
        // planting_organization_id: id,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      const query = `${FIELD_DATA_API}/raw-captures${
        filterObj ? `?${this.makeQueryString(filterObj)}` : ''
      }`;

      return fetch(query, {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  approveCaptureImage(
    capture,
    morphology
    // age
    // captureApprovalTag,
    // speciesId
  ) {
    try {
      const newCapture = {
        id: capture.id,
        session_id: capture.session_id,
        grower_account_id: capture.grower_account_id,
        planting_organization_id: capture.organization_id,
        device_configuration_id: capture.device_configuration_id,
        image_url: capture.image_url,
        lat: capture.lat,
        lon: capture.lon,
        gps_accuracy: capture.gps_accuracy,
        captured_at: capture.captured_at,
        // age,
        morphology,
        // species_id: speciesId, // need uuid
        // captureApprovalTag,  // how does this fit into the new API?
      };

      log.debug('newCapture data', newCapture);

      // update the raw capture
      fetch(`${FIELD_DATA_API}/raw-captures/${capture.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: capture.id,
          status: 'approved',
          // age,
          morphology,
          // species_id: speciesId, // need uuid
          // captureApprovalTag,  // how does this fit into the new API?
        }),
      }).then(handleResponse);

      // add the new capture
      fetch(`${TREETRACKER_API}/captures`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(newCapture),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  rejectCaptureImage(capture, rejection_reason) {
    try {
      log.debug('reject capture', capture.id, rejection_reason);
      const query = `${FIELD_DATA_API}/raw-captures/${capture.id}`;
      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: capture.id,
          status: 'rejected',
          rejection_reason,
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  undoCaptureImage(id) {
    try {
      log.debug('undo approve/reject capture', id);
      const query = `${FIELD_DATA_API}/raw-captures/${id}`;
      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: id,
          status: 'unprocessed',
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /**
   * Capture Match Tool
   */
  fetchCapturesToMatch(currentPage, abortController, filter) {
    try {
      const where = Object.keys(filter)
        .map((key) => (filter[key] ? `${key}=${filter[key]}` : ''))
        .join('&');

      const req = `${TREETRACKER_API}/captures?tree_associated=false&limit=${1}&offset=${
        currentPage - 1
      }&order=asc&${where}`;
      return fetch(req, {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  fetchCandidateTrees(captureId, abortController) {
    try {
      const query = `${TREETRACKER_API}/trees/potential_matches?capture_id=${captureId}`;
      return fetch(query, {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  getGrowerAccountById(id) {
    try {
      const query = `${TREETRACKER_API}/grower_accounts/${id}`;
      return fetch(query, {
        headers: {
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /**
   * Verify & Captures -- Captures Detail Dialog
   */
  getCaptureById(url, id, abortController) {
    try {
      // use field data api for Verify and  use query api for Captures
      const query = `${url}/${id}`;
      log.debug('getCaptureById ---> ', query);
      return fetch(query, {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /**
   * Earnings Tool
   */
  /**
   * @function
   * @name getEarnings
   * @description get earnings
   *
   * @returns {Array} - list of earnings
   */
  getEarnings() {
    try {
      const query = `earnings.json`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /*
   * Species
   */
  getSpecies(abortController) {
    try {
      const query = `${API_ROOT}/api/species?filter[order]=name`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  getSpeciesById(id) {
    try {
      const query = `${API_ROOT}/api/species/${id}`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  createSpecies(payload) {
    try {
      const query = `${API_ROOT}/api/species`;

      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          name: payload.name,
          desc: payload.desc,
          active: true,
          valueFactor: 0,
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  editSpecies(id, name, desc) {
    try {
      const query = `${API_ROOT}/api/species/${id}`;

      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: id,
          name: name,
          desc: desc,
          active: true,
          valueFactor: 0,
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  deleteSpecies(id) {
    try {
      const query = `${API_ROOT}/api/species/${id}`;

      return fetch(query, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  combineSpecies(combine, name, desc) {
    try {
      const query = `${API_ROOT}/api/species/combine`;

      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          combine,
          species: {
            name,
            desc,
            active: true,
            valueFactor: 0,
          },
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /*
   * TODO: There is no support for filtering or counting by species now
   */
  getCaptureCountPerSpecies(speciesId, abortController) {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}trees/count?&where[speciesId]=${speciesId}`;

      return fetch(query, {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /*
   * Tags
   */
  getTags(abortController) {
    try {
      // const filterString = `order=name`;
      // const query = `${TREETRACKER_API}/tags?${filterString}`;
      const query = `${TREETRACKER_API}/tags`; // TODO: order is not allowed

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  getTagById(id) {
    try {
      const query = `${TREETRACKER_API}/tags/${id}`;
      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  createTag(tag) {
    log.debug('createTag ---> ', tag);
    try {
      const query = `${TREETRACKER_API}/tags`;
      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(tag),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  /*
   * Capture Tags
   */
  createCaptureTags(capture_id, tags) {
    log.debug('createCaptureTags ---> ', capture_id, tags);
    try {
      const query = `${TREETRACKER_API}/captures/${capture_id}/tags`;

      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({ tags }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  async getCaptureTags(captureIds = []) {
    try {
      const result = captureIds.map((id) => {
        const query = `${TREETRACKER_API}/captures/${id}/tags`;

        return fetch(query, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: session.token,
          },
        }).then(handleResponse);
      });

      return Promise.all(result);
    } catch (error) {
      handleError(error);
    }
  },
  /*
   * get organizations
   */
  getOrganizations() {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}organizations?filter[where][type]=O&filter[order]=name`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  getAdminUserById(id) {
    try {
      const query = `${API_ROOT}/auth/admin_users/${id}`;

      return fetch(query, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
};
