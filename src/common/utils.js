import { verificationStates } from './variables';

export const getVerificationStatus = (active, approved) => {
  if (active === true && approved === false) {
    return verificationStates.AWAITING;
  } else if (active === true && approved === true) {
    return verificationStates.APPROVED;
  } else if (active === false && approved === false) {
    return verificationStates.REJECTED;
  }
};

export const countAppliedFilters = (filter) => {
  let numFilters = 0;

  if (!filter) {
    return numFilters;
  }

  if (filter['active'] !== undefined && filter['approved'] !== undefined) {
    numFilters += 1;
  }

  Object.keys(filter).forEach(key => {
    if (key === 'filter' || key == 'active' || key == 'approved') {
      return;
    } else if ((key === 'captureId' || key === 'uuid' || key === 'deviceIdentifier' || key === 'planterId' || key === 'planterIdentifier') && filter[key] !== '') {
      numFilters += 1;
    } else if (filter['tagId'] > 0) {
      numFilters += 1;
    } else if ((key === 'dateStart' || key === 'dateEnd') && filter[key] !== undefined) {
      numFilters += 1;
    } else if (key == 'organizationId' && filter[key] !== 'ALL_ORGANIZATIONS') {
      numFilters += 1;
    } else if (key == 'speciesId' && filter[key] !== 'ALL_SPECIES') {
      numFilters += 1;
    } else if (key == 'tokenId' && filter[key] !== 'All') {
      numFilters += 1;
    }
  });

  return numFilters;
};