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

export const CONTRACT_STATUS = {
  all: 'all',
  unsigned: 'unsigned', // db default state
  signed: 'signed',
  completed: 'completed',
  aborted: 'aborted',
  cancelled: 'cancelled',
};

export const COORDINATOR_ROLES = {
  all: 'all',
  supervisor: 'supervisor',
  area_manager: 'area_manager',
};

export const CURRENCY = {
  all: 'all',
  USD: 'USD',
  SLL: 'SLL',
};

export const AGREEMENT_STATUS = {
  all: 'all',
  planning: 'planning', // db default state
  open: 'open',
  closed: 'closed',
  aborted: 'aborted',
};

export const AGREEMENT_TYPE = {
  all: 'all',
  grower: 'grower',
  nursury: 'nursury',
  village_champion: 'village_champion',
};

export const SPECIES_TYPE = {
  other: 'other',
  any: 'any',
  specific: 'specific',
  genus: 'genus',
};

// These are the default min/max dates for the MUI KeyboardDatePicker component
// See https://material-ui-pickers.dev/api/KeyboardDatePicker
// If we set minDate or maxDate to null on this component, the fwd/back buttons are disabled
export const datePickerDefaultMinDate = '1900-01-01';
