import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';
import log from 'loglevel';

// Set API as a variable
const API_ROOT = process.env.REACT_APP_API_ROOT;
const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_ROOT;
const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;

const CAPTURE_FIELDS = {
  uuid: true,
  imageUrl: true,
  lat: true,
  lon: true,
  id: true,
  timeCreated: true,
  timeUpdated: true,
  active: true,
  approved: true,
  planterId: true,
  deviceIdentifier: true,
  planterIdentifier: true,
  speciesId: true,
  tokenId: true,
  morphology: true,
  age: true,
  captureApprovalTag: true,
  rejectionReason: true,
  note: true,
};

export default {
  /**
   * Verify Tool
   */
  getCaptureImages(
    {
      skip,
      rowsPerPage,
      orderBy = 'id',
      order = 'desc',
      //the filter model
      filter,
    },
    abortController
  ) {
    try {
      const where = filter.getWhereObj();

      const filterData = {
        where,
        order: [`${orderBy} ${order}`],
        limit: rowsPerPage,
        skip,
        fields: CAPTURE_FIELDS,
      };

      log.debug('getCaptureImages', filterData);

      const query = `${API_ROOT}/api/${getOrganization()}trees?filter=${JSON.stringify(
        filterData
      )}`;

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
  approveCaptureImage(capture, morphology, speciesId, captureApprovalTag) {
    try {
      log.debug('approveCaptureImage', capture, captureApprovalTag);

      // map legacy data to fields for new microservice
      const newCapture = {
        id: capture.uuid,
        reference_id: capture.id,
        session_id: capture.session_id, // no legacy equivalent
        planterId: capture.planterId, // legacy only
        grower_account_id: capture.grower_account_id, // no legacy equivalent
        planting_organization_id: capture.organization_id,
        device_configuration_id: capture.device_configuration_id, // no legacy equivalent
        image_url: capture.imageUrl,
        lat: capture.lat,
        lon: capture.lon,
        gps_accuracy: capture.gps_accuracy,
        captured_at: capture.timeCreated,
        note: capture.note,
        morphology,
        species_id: speciesId, // need uuid
        // captureApprovalTag, // how does this fit into the new API?
      };

      log.debug('newCapture data', newCapture);

      // update the raw capture
      fetch(`${FIELD_DATA_API}/raw-captures/${capture.uuid}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          status: 'approved',
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
      log.debug('reject capture', capture.uuid, rejection_reason);
      const query = `${FIELD_DATA_API}/raw-captures/${capture.uuid}`;
      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason,
        }),
      }).then(handleResponse);
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

      const req = `${TREETRACKER_API}/captures?tree_associated=false&limit=${1}&offset=${
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
  getCaptureById(id) {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}trees/${id}`;

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
      const query = `${TREETRACKER_API}/tags`; // TODO: order is not allowed as a filter

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
      //     const query = `${API_ROOT}/api/tags/${id}`;
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
