import { 
  handleResponse, 
  handleError,
  getOrganization,
} from "./apiUtils";
import {session} from "../models/auth";

export default {
  getPlanter(id) {
    const planterQuery = `${process.env.REACT_APP_API_ROOT}/api/${getOrganization()}planter/${id}`;

    return fetch(planterQuery, {
      method: "GET",
      headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
    })
      .then(handleResponse)
      .catch(handleError);
  },

  getPlanters({ skip, rowsPerPage, orderBy = "id", order = "desc", filter }) {
    const query =
      `${process.env.REACT_APP_API_ROOT}/api/${getOrganization()}planter?` +
      `filter[order]=${orderBy} ${order}&` +
      `filter[limit]=${rowsPerPage}&` +
      `filter[skip]=${skip}&` +
      `filter[fields][firstName]=true&` +
      `filter[fields][lastName]=true&` +
      `filter[fields][imageUrl]=true&` +
      `filter[fields][email]=true&` +
      `filter[fields][phone]=true&` +
      `filter[fields][personId]=true&` +
      `filter[fields][organization]=true&` +
      `filter[fields][organizationId]=true&` +
      `filter[fields][id]=true&` +
      //the filter query
      (filter? filter.getBackloopString():"");
    return fetch(query,{
      headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
    }).then(handleResponse).catch(handleError);
  },

  getCount({
    filter,
  }){
    const query = 
      `${process.env.REACT_APP_API_ROOT}/api/${getOrganization()}planter/count?${
        filter && filter.getBackloopString(false)
      }`
    return fetch(query,{
      headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
    }).then(handleResponse).catch(handleError);
  },

  getPlanterRegistrations(planterId) {
    const registrationQuery =
      `${process.env.REACT_APP_API_ROOT}/api/planter-registration?filter[where][planterId]=${planterId}`;
    return fetch(registrationQuery, {
      method: "GET",
      headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
    })
      .then(handleResponse)
      .catch(handleError)
  },

  getPlanterSelfies(planterId) {
    const filter = {
      order: 'timeUpdated DESC',
      limit: 100,
      fields: ['planterPhotoUrl'],
      where: { planterId, planterPhotoUrl: { neq: null } }
    }

    const treeQuery = 
      `${process.env.REACT_APP_API_ROOT}/api/${getOrganization()}trees/?filter=${JSON.stringify(filter)}`

     return fetch(treeQuery, {
       method: 'GET',
       headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
    })
      .then(handleResponse)
      .then((items) => {
        // Remove duplicates
        return [...new Set(items.map(tree => tree.planterPhotoUrl))]
      })
      .catch(handleError)
  },

  updatePlanter(planterUpdate) {
    const { id } = planterUpdate;
    const planterQuery = `${process.env.REACT_APP_API_ROOT}/api/${getOrganization()}planter/${id}`;

    return fetch(planterQuery, {
      method: "PATCH",
      headers: { 
        "content-type": "application/json" ,
        Authorization: session.token ,
      },
      body: JSON.stringify(planterUpdate),
    })
      .then(handleResponse)
      .catch(handleError);
  },
};
