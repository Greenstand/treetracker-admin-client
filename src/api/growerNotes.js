import { handleResponse, handleError, getOrganization } from './apiUtils';
import { session } from '../models/auth';

export default {
  getNotes(growerId) {
    try {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${growerId}/notes`;

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

  addNote(growerId, content) {
    try {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${growerId}/notes`;

      return fetch(query, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({ content }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  updateNote(growerId, noteId, content) {
    try {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${growerId}/notes/${noteId}`;

      return fetch(query, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify({ content }),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  deleteNote(growerId, noteId) {
    try {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}planter/${growerId}/notes/${noteId}`;

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
};
