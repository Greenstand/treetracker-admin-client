import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name earningTableDateFilterStyles
 * @description styles for EarningsTableFilter component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles object
 */
const earningTableDateFilterStyles = (theme) => ({
  dateFilterHeader: {
    padding: theme.spacing(0, 0, 5, 0),
  },
  earningTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats.white,
  },
  earningTableFilterResetButton: {
    border: 'none',
  },
  earningsTableFilterForm: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
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
  earningsFilterSelectFormControl: {
    margin: theme.spacing(2, 0, 2, 0),
    width: '100%',
  },

  // styles for export button
  csvLink: {
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'flex-end',
    textDecoration: 'none',
  },
});

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles((theme) => {
  const earningTableDateFilter = earningTableDateFilterStyles(theme);

  return { ...earningTableDateFilter };
});

export default useStyles;
