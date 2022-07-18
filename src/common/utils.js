import { verificationStates } from './variables';

export const getVerificationStatus = (status) => {
  if (status === 'unprocessed') {
    return verificationStates.AWAITING;
  } else if (status === 'approved') {
    return verificationStates.APPROVED;
  } else if (status === 'rejected') {
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
