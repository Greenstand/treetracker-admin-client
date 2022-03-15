import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

export default {
  getRegion() {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/region`;

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
  async getAuthors(organizationId) {
    let query = `${process.env.REACT_APP_GROWER_QUERY_API_ROOT}/grower_accounts?author=true`;
    if (organizationId) {
      query = `${query}&organization_id=${organizationId}`;
    }

    const res = await fetch(query, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);

    const mappedRes = await res.growerAccounts.map((author) => {
      return { ...author, avatar: author.image_url };
    });
    return mappedRes;
  },

  postRegion(payload) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/region`;
    const { id, name, description, created_at } = payload;

    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify({ id, name, description, created_at }),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getRegionById(region_id) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/region/${region_id}`;

    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getMessages(handle) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message?handle=${handle}&limit=500`;

    return fetch(query).then(handleResponse).catch(handleError);
  },
  postMessage(payload) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message`;

    return fetch(query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify({ ...payload }),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  postMessageSend(payload) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message`;

    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  postBulkMessageSend(payload) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/bulk_message`;

    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  getSurvey(surveyId) {
    const query = `${process.env.REACT_APP_MESSAGING_ROOT}/survey/${surveyId}`;
    return fetch(query).then(handleResponse).catch(handleError);
  },
};
