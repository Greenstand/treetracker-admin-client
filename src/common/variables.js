export const drawerWidth = 240;
export const selectedHighlightColor = '#0af';
export const documentTitle = 'Treetracker Admin by Greenstand';
export const verificationStates = {
  APPROVED: 'Approved',
  AWAITING: 'Awaiting Verification',
  REJECTED: 'Rejected',
};
export const captureStatus = {
  APPROVED: 'approved',
  UNPROCESSED: 'unprocessed',
  REJECTED: 'rejected',
};
export const tokenizationStates = {
  TOKENIZED: 'Tokenized',
  NOT_TOKENIZED: 'Not Tokenized',
};
export const verificationStatesArr = [
  verificationStates.APPROVED,
  verificationStates.AWAITING,
  verificationStates.REJECTED,
];

// These are the default min/max dates for the MUI KeyboardDatePicker component
// See https://material-ui-pickers.dev/api/KeyboardDatePicker
// If we set minDate or maxDate to null on this component, the fwd/back buttons are disabled
export const datePickerDefaultMinDate = '1900-01-01';
