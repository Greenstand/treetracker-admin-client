import { verificationStates } from './variables';
import { ALL_ORGANIZATIONS, ORGANIZATION_NOT_SET } from '../models/Filter';
// import log from 'loglevel';

export const getVerificationStatus = (active, approved) => {
  if (active === true && approved === false) {
    return verificationStates.AWAITING;
  } else if (active === true && approved === true) {
    return verificationStates.APPROVED;
  } else if (active === false && approved === false) {
    return verificationStates.REJECTED;
  }
};

export const setOrganizationFilter = (filter, userOrgId, orgList) => {
  // NOTE: userOrgId is the id of the logged-in user's organization

  if (filter.organization_id === ALL_ORGANIZATIONS && userOrgId) {
    // if userOrgId has a value filter by userOrgId and sub-orgs, don't include null org ids
    // also, prevent it from being assigned an empty array
    if (orgList.length) {
      filter.organization_id = orgList.map((org) => org.stakeholder_uuid);
    }
  } else if (
    filter.organization_id === ALL_ORGANIZATIONS &&
    userOrgId === null
  ) {
    // don't filter if userOrgId is null so that we include both null and not null org ids in results
    filter.organization_id = undefined;
  } else if (
    filter.organization_id === ORGANIZATION_NOT_SET ||
    filter.organization_id === null
  ) {
    // if filtering for items without an org id, filter for null
    filter.organization_id = null;
  } else if (
    filter.organization_id &&
    typeof filter.organization_id === 'string'
  ) {
    // if filtering by one org id, format in array for api query
    filter.organization_id = [filter.organization_id];
  } else {
    filter.organization_id = undefined;
  }

  return filter;
};

export const localeSort = (arr, order) => {
  return arr.sort((a, b) => {
    const orderVal = order === 'desc' ? -1 : 1;
    let sortVal = 0;
    if (a && b) {
      sortVal = a.localeCompare(b);
    } else {
      // if one of them is null or undefined, sort it to the end
      sortVal = (a || '') > (b || '') ? 1 : -1;
    }
    return sortVal * orderVal;
  });
};
