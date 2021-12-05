import {
  handleResponse,
  handleError,
  getOrganization,
  getOrganizationId,
} from './apiUtils';
import { session } from '../models/auth';

const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;

export default {
  getStakeholderById(id) {
    const orgId = getOrganizationId();
    let stakeholderQuery = '';
    if (Number(orgId)) {
      stakeholderQuery = `${STAKEHOLDER_API}/${orgId}`;
    } else if (id) {
      stakeholderQuery = `${STAKEHOLDER_API}?id=${id}`;
    } else {
      stakeholderQuery = `${STAKEHOLDER_API}`;
    }

    console.log('getStakeholderById ---->', stakeholderQuery);

    return fetch(stakeholderQuery, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getStakeholders({
    offset,
    rowsPerPage,
    orderBy = 'id',
    order = 'desc',
    filter,
  }) {
    const where = filter.getWhereObj ? filter.getWhereObj() : {};
    const stakeholderFilter = {
      where: { ...where, active: true },
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      offset,
      fields: {
        id: true,
        type: true,
        orgName: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
        phone: true,
        website: true,
        logoUrl: true,
        mapName: true,
        stakeholder_uuid: true,
        organizationId: true,
      },
    };
    const query = `${STAKEHOLDER_API}/stakeholder?filter=${JSON.stringify(
      stakeholderFilter,
    )}`;

    console.log(
      'getStakeholders ---> ',
      query,
      'org ---> ',
      getOrganizationId(),
    );

    return fetch(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  updateStakeholder(stakeholderUpdate) {
    if (stakeholderUpdate.organizationId === 'null') {
      stakeholderUpdate = { ...stakeholderUpdate, organizationId: null };
    }
    const { id } = stakeholderUpdate;
    const stakeholderQuery = `${STAKEHOLDER_API}/${getOrganization()}stakeholder/${id}`;

    return fetch(stakeholderQuery, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
      body: JSON.stringify(stakeholderUpdate),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
