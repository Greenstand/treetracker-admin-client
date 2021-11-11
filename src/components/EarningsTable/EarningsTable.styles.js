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
};

/**
 * @constant
 * @type {object}
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  earningsTableTopar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '20px',
  },
  fiterButonSmallText: {
    color: COLORS.carbonGrey,
    fontSize: '0.8em',
    textAlign: 'left',
  },
  fiterButonMediumText: {
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
  earningsTableFilterButton: {
    cursor: 'pointer',
    padding: '10px 15px 10px 15px',
    border: `1px solid ${COLORS.lavenderPinocchio}`,
    borderRadius: '5px',
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
    padding: '40px 60px 0px 60px',
  },
  earningsTableHeader: {
    borderBottom: `2px solid ${COLORS.lavenderPinocchio}`,
  },

  infoIcon: {
    color: `${COLORS.appleGreen}`,
    position: 'relative',
    top: '5px',
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
}));

export default useStyles;
