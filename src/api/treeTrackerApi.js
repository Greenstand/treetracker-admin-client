import { handleResponse, handleError, getOrganization } from './apiUtils';
import { getVerificationStatus } from '../common/utils';
import { session } from '../models/auth';
import log from 'loglevel';

// Set API as a variable
const API_ROOT = process.env.REACT_APP_API_ROOT;
const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_ROOT;
const QUERY_API = process.env.REACT_APP_QUERY_API_ROOT;
const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;
const STATUS_STATES = {
  Approved: 'approved',
  Rejected: 'rejected',
  'Awaiting Verification': 'unprocessed',
};

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
      where.status =
        STATUS_STATES[getVerificationStatus(where.active, where.approved)];
      delete where.active;
      delete where.approved;

      const filterObj = {
        ...where,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      const query = `${QUERY_API}/raw-captures${
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
  getRawCaptureCount({ filter }, abortController) {
    try {
      const where = filter.getWhereObj();
      where.status =
        STATUS_STATES[getVerificationStatus(where.active, where.approved)];
      delete where.active;
      delete where.approved;

      const filterObj = { ...where };

      const query = `${QUERY_API}/raw-captures/count${
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
  approveCaptureImage(capture, morphology, age, speciesId) {
    try {
      // Note: not all raw-capture fields are added to a capture
      const newCapture = {
        id: capture.id,
        reference_id: capture.reference_id,
        session_id: capture.session_id,
        grower_account_id: capture.grower_account_id,
        planting_organization_id: capture.organization_id,
        device_configuration_id: capture.device_configuration_id,
        image_url: capture.image_url,
        lat: capture.lat,
        lon: capture.lon,
        gps_accuracy: capture.gps_accuracy,
        captured_at: capture.captured_at,
        note: capture.note ? capture.note : null,
        age: age,
        morphology,
        species_id: speciesId,
      };

      // add the new capture
      return fetch(`${TREETRACKER_API}/captures`, {
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
  async rejectCaptureImage(capture, rejectionReason) {
    try {
      log.debug('reject capture', capture.id, rejectionReason);
      const query = `${FIELD_DATA_API}/raw-captures/${capture.id}/reject`;
      const data = await fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      }).then(handleResponse);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  getCaptureCount(filter) {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}trees/count?where=${JSON.stringify(
        filter.getWhereObj()
      )}`;

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
   * Capture Match Tool
   */
  fetchCapturesToMatch(currentPage, abortController, filter) {
    try {
      const where = Object.keys(filter)
        .map((key) => (filter[key] ? `${key}=${filter[key]}` : ''))
        .join('&');

      const req = `${TREETRACKER_API}/captures?order_by=captured_at&tree_associated=false&limit=${1}&offset=${
        currentPage - 1
      }&${where}`;

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
  getCaptureById(url, id, abortController) {
    try {
      // use field data api for Verify and query api for Captures
      const query = `${url}/${id}`;
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
      const query = `${API_ROOT}/api/species?filter={"where":{"uuid": "${id}"}}`;

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
      // TODO: order is not allowed as a filter
      // const filterString = `order=name`;
      // const query = `${TREETRACKER_API}/tags?${filterString}`;
      const query = `${TREETRACKER_API}/tags`;

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
  createCaptureTags(captureId, tags) {
    try {
      const query = `${TREETRACKER_API}/captures/${captureId}/tags`;

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
  async getCaptureTags({ captureIds = [] }) {
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
  getLegacyCaptureTags({ captureIds, tagIds }) {
    try {
      const useAnd = captureIds && tagIds;
      const captureIdClauses = (captureIds || []).map(
        (id, index) =>
          `filter[where]${useAnd ? '[and][0]' : ''}[or][${index}][treeId]=${id}`
      );
      const tagIdClauses = (tagIds || []).map(
        (id, index) =>
          `filter[where][and]${
            useAnd ? '[and][1]' : ''
          }[or][${index}][tagId]=${id}`
      );

      const filterString = [...captureIdClauses, ...tagIdClauses].join('&');
      const query = `${API_ROOT}/api/tree_tags?${filterString}`;

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
   * get organizations
   */
  getOrganizations() {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}organizations?filter[where][type]=O&filter[order]=name`;

      log.debug('GET ORGANIZATIONS -----', query);

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
