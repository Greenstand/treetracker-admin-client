import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name CustomTableTopBarStyles
 * @description styles for CustomTableTopBar component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles for CustomTableTopBar component
 */
const customTableTopBarStyles = (theme) => ({
  uploadFileInput: {
    display: 'none',
  },
  csvLink: {
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'flex-end',
    textDecoration: 'none',
  },
  customTableTopBar: {
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
  customTableTopTitle: {
    padding: theme.spacing(0, 0, 0, 2),
  },
  customTableDateFilterButton: {
    padding: theme.spacing(3, 4),
    margin: theme.spacing(1),
  },
  filterButton: {
    padding: theme.spacing(4, 4),
    margin: theme.spacing(1),
  },
});

/**
 * @function
 * @name customTableFilterStyles
 * @description styles for CustomTableFilter component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles for CustomTableFilter component
 */
const customTableFilterStyles = (theme) => ({
  customTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats.white,
  },
  customTableFilterResetButton: {
    border: 'none',
  },
  customTableFilterForm: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
  },
  customTableHeader: {
    borderBottom: `${theme.spacing(0.5)} solid ${
      theme.palette.stats.lavenderPinocchio
    }`,
  },
  customTableFilterCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  customTableFilterAvatar: {
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(2),
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
  customFIlterSelectFormControl: {
    margin: theme.spacing(2, 0, 2, 0),
  },
});

/**
 * @function
 * @name customTableStyles
 * @description styles for CustomTable component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles for CustomTable component
 */
const customTableStyles = (theme) => ({
  noDataToDisplay: {
    color: theme.palette.stats.lavenderPinocchio,
    fontSize: theme.spacing(5),
    padding: theme.spacing(5, 0, 5, 0),
    position: 'relative',
    left: theme.spacing(120),
    bottom: theme.spacing(0),
  },

  progressContainer: {
    padding: theme.spacing(5, 0, 5, 0),
    position: 'relative',
    left: theme.spacing(120),
    bottom: theme.spacing(0),
  },
  customTable: {
    padding: theme.spacing(0, 10, 0, 10),
  },
  selectedRow: {
    backgroundColor: theme.palette.primary.lightVery,
  },
  customTableHeadSortIcon: {
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

  customTablePagination: {
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

const customDetailsStyles = (theme) => ({
  customDetailsContents: {
    padding: theme.spacing(5, 0, 0, 0),
  },
  customGrowerDetail: {
    padding: theme.spacing(1, 0, 0, 0),
    color: theme.palette.stats.carbonGrey,
  },
  customDetailsContentsDivider: {
    margin: theme.spacing(4, 0, 4, 0),
  },
  infoIconOutlined: {
    color: `${theme.palette.primary.main}`,
    padding: theme.spacing(1),
    margin: theme.spacing(0, 1, 0, 0),
    fontSize: theme.spacing(4),
    position: 'relative',
    bottom: theme.spacing(-2),
    right: theme.spacing(0.5),
  },
});

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles((theme) => {
  const customTableTopBar = customTableTopBarStyles(theme);
  const customTable = customTableStyles(theme);
  const customTableFilter = customTableFilterStyles(theme);
  const customDetails = customDetailsStyles(theme);

  return {
    ...customTableTopBar,
    ...customTable,
    ...customTableFilter,
    ...customDetails,
  };
});

export default useStyles;
