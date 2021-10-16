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