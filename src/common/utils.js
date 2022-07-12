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
