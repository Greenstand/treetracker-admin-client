import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = (theme) => ({
  csvLink: {
    color: theme.palette.primary.main,
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
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: '0.75rem',
    width: '25px',
    height: '25px',
  },

  iconFilter: {
    color: theme.palette.primary.main,
  },

  filterButtonText: {
    color: theme.palette.stats.black,
    fontSize: '1.2em',
  },
  dateFiterButonSmallText: {
    color: theme.palette.stats.carbonGrey,
    fontSize: '0.8em',
    textAlign: 'left',
  },
  dateFiterButonMediumText: {
    fontSize: '1.1em',
    textAlign: 'left',
  },
  actionButton: {
    color: theme.palette.primary.main,
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
});

/**
 * @constant
 * @name earningTableFilterStyles
 * @description styles for EarningsTableFilter component
 */
const earningTableFilterStyles = (theme) => ({
  earningTableFilterSubmitButton: {
    marginBottom: '10px',
    color: theme.palette.stats.white,
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
    borderBottom: `2px solid ${theme.palette.stats.lavenderPinocchio}`,
  },
  earningsTableFilterCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.stats.feta,
  },
  earningsTableFilterAvatar: {
    backgroundColor: theme.palette.stats.feta,
    color: theme.palette.primary.main,
    marginLeft: '0.5rem',
    width: '30px',
    height: '30px',
  },
  earningsFIlterSelectFormControl: {
    width: '100%',
    marginTop: '20px',
  },
});

/**
 * @function
 * @name earningsTableStyles
 * @description styles for EarningsTable component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles for EarningsTable component
 */
const earningsTableStyles = (theme) => ({
  earningsTable: {
    padding: '0px 40px 0px 40px',
  },

  earningsTableHeadSortIcon: {
    color: `${theme.palette.primary.main} !important`,
    padding: '1px',
    backgroundColor: theme.palette.primary.lightVery,
    fontSize: '1.5em',
  },

  arrowDropDownIcon: {
    color: `${theme.palette.primary.main}`,
    position: 'relative',
    top: '5px',
    left: '5px',
  },

  infoIcon: {
    color: `${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.lightVery,
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
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    borderRadius: '3px',
    padding: '4px',
  },
});

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles((theme) => {
  const earningsTableTopBar = earningsTableTopBarStyles(theme);
  const earningsTable = earningsTableStyles(theme);
  const earningTableFilter = earningTableFilterStyles(theme);

  return {
    ...earningsTableTopBar,
    ...earningsTable,
    ...earningTableFilterStyles,
  };
});

export default useStyles;
