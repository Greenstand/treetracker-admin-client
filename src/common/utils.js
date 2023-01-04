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

export const setOrganizationFilter = (filter, orgId, orgList) => {
  console.log(
    'setOrganizationFilter 1 ==========',
    filter.organization_id,
    orgId
  );

  // if orgId has a value filter by orgId and sub-orgs, don't include null org ids
  if (
    (filter.organization_id === ALL_ORGANIZATIONS && orgId) ||
    (filter.organization_id === orgId && orgId)
  ) {
    // prevent it from being assigned an empty array
    if (orgList.length) {
      filter.organization_id = orgList.map((org) => org.stakeholder_uuid);
    }
  }

  // don't filter if orgId is null so that we include both null and not null org ids
  if (filter.organization_id === ALL_ORGANIZATIONS && orgId === null) {
    // don't add to filter
    filter.organization_id = undefined;
  }

  // if filtering by one org id, format in array for api query
  if (filter.organization_id && typeof filter.organization_id === 'string') {
    filter.organization_id = [filter.organization_id];
  }

  // if filtering for items without an org id, filter for null
  if (filter.organization_id === ORGANIZATION_NOT_SET) {
    filter.organization_id = null;
  }

  // delete filter.organization_id;

  console.log('setOrganizationFilter 2 ==========', filter);
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
