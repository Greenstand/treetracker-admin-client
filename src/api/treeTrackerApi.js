import {
  handleResponse,
  handleError,
  getOrganization,
  getOrganizationUUID,
} from './apiUtils';
import { session } from '../models/auth';
import log from 'loglevel';

// Set API as a variable
const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;
const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_ROOT;
const API_ROOT = process.env.REACT_APP_API_ROOT;

function makeQueryString(filterObj) {
  let query = '';
  for (const key in filterObj) {
    if (filterObj[key] && filterObj[key] !== '') {
      query += `&${key}=${filterObj[key]}`;
    }
  }
  return query;
}

export default {
  /**
   * Verify Tool
   */
  getCaptureImages(
    {
      page = 0,
      rowsPerPage,
      // TODO: need to be implemented with field data API
      // orderBy = 'captured_at',
      // order = 'desc',
      // filter,
    },
    abortController
  ) {
    try {
      // const where = filter.getWhereObj();
      const id = getOrganizationUUID();
      const filterObj = {
        // ...where,
        planting_organization_id: id,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      log.debug('getCaptureImages filter:', id, filterObj);

      const query = `${FIELD_DATA_API}/raw-captures${
        id != null ? '/' + id : ''
      }${filterObj ? `?${makeQueryString(filterObj)}` : ''}`;

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
      const query = `${TREETRACKER_API}/captures/${id}`;

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
      log.debug('reject capture', id, rejectionReason);
      const query = `${TREETRACKER_API}/captures/${id}`;
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
   * Verify & Captures Tool
   */
  getCaptureById(id, abortController) {
    try {
      const query = `${FIELD_DATA_API}/raw-captures/${id}`;
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
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}trees/count?&where[speciesId]=${speciesId}`;

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
      // const filterString = `order=tagName`;
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
  createTag(tagName) {
    const query = `${TREETRACKER_API}/tags`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /*
   * Capture Tags
   */
  createCaptureTags(captureId, tags) {
    try {
      return tags.map((t) => {
        const query = `${process.env.REACT_APP_API_ROOT}/api/tree_tags`;

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
  async getCaptureTags({ captureIds, tagIds }) {
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
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}organizations?filter[where][type]=O&filter[order]=name`;

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
