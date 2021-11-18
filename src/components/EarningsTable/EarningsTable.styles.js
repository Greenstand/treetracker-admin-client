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
    padding: theme.spacing(10, 0, 5, 0),
  },
  filterAvatar: {
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(3),
    width: theme.spacing(6.25),
    height: theme.spacing(6.25),
  },

  iconFilter: {
    color: theme.palette.primary.main,
  },

  filterButtonText: {
    color: theme.palette.stats.black,
    fontSize: theme.spacing(4.5),
  },
  dateFiterButonSmallText: {
    color: theme.palette.stats.carbonGrey,
    fontSize: theme.spacing(3),
    textAlign: 'left',
  },
  dateFiterButonMediumText: {
    fontSize: theme.spacing(3.5),
    textAlign: 'left',
  },
  actionButton: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  earningsTableTopTitle: {
    padding: theme.spacing(0, 0, 0, 2),
  },
  earningsTableDateFilterButton: {
    padding: theme.spacing(3, 7.5, 3, 4),
  },
  filterButton: {
    padding: theme.spacing(4, 7.5, 5, 4),
  },
});

/**
 * @constant
 * @name earningTableFilterStyles
 * @description styles for EarningsTableFilter component
 */
const earningTableFilterStyles = (theme) => ({
  earningTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats.white,
  },
  earningTableFilterCancelButton: {
    border: 'none',
  },
  earningsTableFilterForm: {
    width: theme.spacing(75),
    padding: theme.spacing(5, 3.75),
  },
  earningsTableHeader: {
    borderBottom: `${theme.spacing(0.5)} solid ${
      theme.palette.stats.lavenderPinocchio
    }`,
  },
  earningsTableFilterCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  earningsTableFilterAvatar: {
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(2),
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
  earningsFIlterSelectFormControl: {
    marginTop: theme.spacing(6),
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
    padding: theme.spacing(0, 10, 0, 10),
  },

  earningsTableHeadSortIcon: {
    color: `${theme.palette.primary.main} !important`,
    padding: theme.spacing(0.25),
    backgroundColor: theme.palette.primary.lightVery,
    fontSize: theme.spacing(6),
  },

  arrowDropDownIcon: {
    color: `${theme.palette.primary.main}`,
    position: 'relative',
    top: theme.spacing(1),
    left: theme.spacing(1),
  },

  infoIcon: {
    color: `${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.lightVery,
    padding: theme.spacing(1),
    margin: theme.spacing(0, 1, 0, 0),
    fontSize: theme.spacing(4),
    position: 'relative',
    top: theme.spacing(1),
    left: theme.spacing(1),
  },

  earningsTablePagination: {
    border: 'none',
    paddingRight: theme.spacing(0),
  },
  selectRoot: {
    border: `${theme.spacing(0.25)} solid ${
      theme.palette.stats.lavenderPinocchio
    }`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
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
    ...earningTableFilter,
  };
});

export default useStyles;
