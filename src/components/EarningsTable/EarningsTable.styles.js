import { makeStyles } from '@material-ui/core/styles';

/**
 * @constant
 * @type {object}
 * @description possible colors for earning table component
 * @see {@link https://colors.artyclick.com/color-name-finder/}  - to learn how
 *  color names are generated
 */
const COLORS = {
  appleGreen: '#86C232',
  lavenderPinocchio: '#E0E0E0',
  carbonGrey: '#585B5D',
  black: '#000',
  white: '#fff',
  feta: '#F3F9EB',
};

/**
 * @constant
 * @type {object}
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  csvLink: {
    color: COLORS.appleGreen,
    display: 'flex',
    alignItems: 'flex-end',
    textDecoration: 'none',
  },
  earningsTableTopBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 0px 20px 0px',
  },
  filterAvatar: {
    backgroundColor: COLORS.feta,
    color: COLORS.appleGreen,
    marginLeft: '0.75rem',
    width: '25px',
    height: '25px',
  },

  iconFilter: {
    color: COLORS.appleGreen,
  },

  filterButtonText: {
    color: COLORS.black,
    fontSize: '1.2em',
  },
  dateFiterButonSmallText: {
    color: COLORS.carbonGrey,
    fontSize: '0.8em',
    textAlign: 'left',
  },
  dateFiterButonMediumText: {
    fontSize: '1.1em',
    textAlign: 'left',
  },
  actionButton: {
    color: COLORS.appleGreen,
    cursor: 'pointer',
  },
  actionButtonIcon: {
    position: 'relative',
    top: '2px',
  },
  topBarActions: {
    width: '60%',
  },

  earningsTableTopTitle: {
    padding: '0px 0px 0px 10px',
  },
  earningsTableDateFilterButton: {
    padding: '12px 30px 12px 15px',
  },
  filterButton: {
    padding: '15px 30px 20px 15px',
  },
};

/**
 * @constant
 * @name earningTableFilterStyles
 * @description styles for EarningsTableFilter component
 */
const earningTableFilterStyles = {
  earningTableFilterSubmitButton: {
    marginBottom: '10px',
    color: COLORS.white,
  },
  earningTableFilterCancelButton: {
    border: 'none',
  },
  earningsTableFilterForm: {
    width: '300px',
    padding: '20px 15px',
  },
  earningsTableFilterHeader: {},
  earningsTableHeader: {
    borderBottom: `2px solid ${COLORS.lavenderPinocchio}`,
  },
  earningsTableFilterCloseIcon: {
    color: COLORS.appleGreen,
    cursor: 'pointer',
    backgroundColor: COLORS.feta,
  },
  earningsTableFilterAvatar: {
    backgroundColor: COLORS.feta,
    color: COLORS.appleGreen,
    marginLeft: '0.5rem',
    width: '30px',
    height: '30px',
  },
  earningsFIlterSelectFormControl: {
    width: '100%',
    marginTop: '20px',
  },
};

/**
 * @constant
 * @type {object}
 * @name earningsTableStyles
 * @description styles for EarningsTable component
 */
const earningsTableStyles = {
  earningsTable: {
    padding: '0px 40px 0px 40px',
  },

  earningsTableHeadSortIcon: {
    color: `${COLORS.appleGreen} !important`,
    padding: '1px',
    backgroundColor: COLORS.feta,
    fontSize: '1.5em',
  },

  arrowDropDownIcon: {
    color: `${COLORS.appleGreen}`,
    position: 'relative',
    top: '5px',
    left: '5px',
  },

  infoIcon: {
    color: `${COLORS.appleGreen}`,
    backgroundColor: COLORS.feta,
    padding: '3px',
    margin: ' 0 4px 0 0',
    fontSize: '0.9em',
    position: 'relative',
    top: '3px',
    left: '5px',
  },

  earningsTablePagination: {
    border: 'none',
    paddingRight: '0px',
  },
  selectRoot: {
    border: `1px solid ${COLORS.lavenderPinocchio}`,
    borderRadius: '3px',
    padding: '4px',
  },
};

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles(() => ({
  ...earningsTableTopBarStyles,
  ...earningsTableStyles,
  ...earningTableFilterStyles,
}));

export default useStyles;
