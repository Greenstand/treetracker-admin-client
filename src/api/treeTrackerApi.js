import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

// Set API as a variable
const CAPTURE_MATCH_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;
const API_ROOT = process.env.REACT_APP_API_ROOT;

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
  approveCaptureImage(id, morphology, age, captureApprovalTag, speciesId) {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}trees/${id}`;

      console.log(query);

      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: id,
          approved: true,
          //revise, if click approved on a rejected pic, then, should set the pic approved, AND restore to ACTIVE = true
          active: true,
          morphology,
          age,
          captureApprovalTag,
          speciesId: speciesId,
        }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  rejectCaptureImage(id, rejectionReason) {
    try {
      console.log('reject capture', id, rejectionReason);
      const query = `${API_ROOT}/api/${getOrganization()}trees/${id}`;

      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          id: id,
          active: false,
          //revise, if click a approved pic, then, should set active = false and
          //at the same time, should set approved to false
          approved: false,
          rejectionReason,
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
      const req = `${CAPTURE_MATCH_API}/captures?tree_associated=false&limit=${1}&offset=${
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
      const query = `${CAPTURE_MATCH_API}/trees/potential_matches?capture_id=${captureId}`;

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
      const query = `${CAPTURE_MATCH_API}/grower_accounts/${id}`;

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
      const filterString = `filter[order]=tagName`;
      const query = `${API_ROOT}/api/tags?${filterString}`;

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
      const query = `${API_ROOT}/api/tags/${id}`;

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
  createTag(tagName) {
    try {
      const query = `${API_ROOT}/api/tags`;

      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({
          tagName,
          active: true,
          public: true,
        }),
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
      return tags.map((t) => {
        const query = `${API_ROOT}/api/tree_tags`;

        return fetch(query, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: session.token,
          },
          body: JSON.stringify({
            treeId: captureId,
            tagId: t.id,
          }),
        }).then(handleResponse);
      });
    } catch (error) {
      handleError(error);
    }
  },
  getSingleCaptureTag({ captureId, tagId }) {
    try {
      const filterString = `filter[where][treeId]=${captureId}&filter[where][tagId]=${tagId}`;
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
  getCaptureTags({ captureIds, tagIds }) {
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
  deleteCaptureTag({ captureTagId }) {
    try {
      const query = `${API_ROOT}/api/tree_tags/${captureTagId}`;
      console.log(query);
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
  /*
   * get organizations
   */
  getOrganizations() {
    try {
      const query = `${API_ROOT}/api/${getOrganization()}organizations?filter[where][type]=O&filter[order]=name`;

      console.log('GET ORGANIZATIONS -----', query);

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
