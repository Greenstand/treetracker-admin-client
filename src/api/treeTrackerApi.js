import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

// Set API as a variable
const CAPTURE_MATCH_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

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
    const where = filter.getWhereObj();

    const filterData = {
      where,
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip,
      fields: CAPTURE_FIELDS,
    };

    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees?filter=${JSON.stringify(filterData)}`;

    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },
  approveCaptureImage(id, morphology, age, captureApprovalTag, speciesId) {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees/${id}`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  rejectCaptureImage(id, rejectionReason) {
    console.log('reject capture', id, rejectionReason);
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees/${id}`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getCaptureCount(filter) {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees/count?where=${JSON.stringify(
      filter.getWhereObj()
    )}`;
    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /**
   * Capture Match Tool
   */
  fetchCapturesToMatch(currentPage, abortController) {
    return fetch(
      `${CAPTURE_MATCH_API}/captures?tree_associated=false&limit=${1}&offset=${
        currentPage - 1
      }`,
      {
        headers: {
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }
    )
      .then(handleResponse)
      .catch(handleError);
  },
  fetchCandidateTrees(captureId, abortController) {
    const query = `${CAPTURE_MATCH_API}/trees/potential_matches?capture_id=${captureId}`;
    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getCaptureById(id) {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees/${id}`;
    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /**
   * @function
   * @name getEarnings
   * @description get earnings
   *
   * @returns {Array} - list of earnings
   */
  getEarnings() {
    const query = `earnings.json`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /*
   * Species
   */
  getSpecies(abortController) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species?filter[order]=name`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getSpeciesById(id) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species/${id}`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  createSpecies(payload) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  editSpecies(id, name, desc) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species/${id}`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  deleteSpecies(id) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species/${id}`;
    return fetch(query, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  combineSpecies(combine, name, desc) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/species/combine`;
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
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getCaptureCountPerSpecies(speciesId, abortController) {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees/count?&where[speciesId]=${speciesId}`;
    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /*
   * Tags
   */
  getTags(abortController) {
    const filterString = `filter[order]=tagName`;
    const query = `${process.env.REACT_APP_API_ROOT}/api/tags?${filterString}`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      signal: abortController?.signal,
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getTagById(id) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/tags/${id}`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  createTag(tagName) {
    const query = `${process.env.REACT_APP_API_ROOT}/api/tags`;
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
      })
        .then(handleResponse)
        .catch(handleError);
    });
  },
  getCaptureTags({ captureIds, tagIds }) {
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
    const query = `${process.env.REACT_APP_API_ROOT}/api/tree_tags?${filterString}`;
    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  /*
   * get organizations
   */
  getOrganizations() {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}organizations?filter[where][type]=O&filter[order]=name`;

    console.log('GET ORGANIZATIONS -----', query);

    return fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
