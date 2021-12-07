import { handleResponse, handleError } from './apiUtils';
import { session } from '../models/auth';

export default {
  getRegion() {
    const query = `https://dev-k8s.treetracker.org/messaging/region`;

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
  postRegion(payload) {
    const query = `https://dev-k8s.treetracker.org/messaging/region`;
    const { id, name, description, created_at } = payload;

    return fetch(query, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify({ id, name, description, created_at }),
    });
  },
  getRegionById(region_id) {
    const query = `https://dev-k8s.treetracker.org/messaging/region/${region_id}`;

    return fetch(query, {
      headers: {
        Authorization: session.token,
      },
    }).then((res) => console.log(res));
  },
  getMessage(author_handle) {
    const query = `https://dev-k8s.treetracker.org/messaging/message?author_handle=${author_handle}`;

    return fetch(query).then(handleResponse).catch(handleError);
  },
  postMessage(payload) {
    const query = `https://dev-k8s.treetracker.org/messaging/message`;

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
    const query = `https://dev-k8s.treetracker.org/messaging/message/send`;

    fetch(query, {
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
};
