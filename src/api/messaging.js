import { handleError } from './apiUtils';
import { authAxios, publicAxios } from './httpClient';

export default {
  getRegions(organizationId) {
    try {
      let query = `${process.env.REACT_APP_REGION_API_ROOT}/region`;
      if (organizationId) {
        query = `${query}?owner_id=${organizationId}`;
      }

      return authAxios.get(query).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  async getAuthors(organizationId) {
    try {
      let query = `${process.env.REACT_APP_GROWER_QUERY_API_ROOT}/grower_accounts?author=true`;
      if (organizationId) {
        query = `${query}&organization_id=${organizationId}`;
      }

      const res = await authAxios.get(query).then((response) => response.data);

      if (res.grower_accounts) {
        const authors = await res.grower_accounts.map((author) => {
          return { ...author, avatar: author.image_url };
        });
        return authors;
      }
    } catch (error) {
      handleError(error);
    }
  },

  postRegion(payload) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/region`;
      const { id, name, description, created_at } = payload;

      return authAxios
        .post(query, { id, name, description, created_at })
        .then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  getRegionById(region_id) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/region/${region_id}`;

      return authAxios.get(query).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  getMessages(handle) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message?handle=${handle}&limit=500`;

      return publicAxios.get(query).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  postMessage(payload) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message`;

      return authAxios.post(query, { ...payload }).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  postMessageSend(payload) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/message`;

      return authAxios.post(query, payload).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  postBulkMessageSend(payload) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/bulk_message`;

      return authAxios.post(query, payload).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
  getSurvey(surveyId) {
    try {
      const query = `${process.env.REACT_APP_MESSAGING_ROOT}/survey/${surveyId}`;
      return publicAxios.get(query).then((res) => res.data);
    } catch (error) {
      handleError(error);
    }
  },
};
