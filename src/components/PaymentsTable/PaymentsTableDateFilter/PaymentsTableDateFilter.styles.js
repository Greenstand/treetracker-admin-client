import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name paymentTableDateFilterStyles
 * @description styles for PaymentsTableFilter component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles object
 */
const paymentTableDateFilterStyles = (theme) => ({
  dateFilterHeader: {
    padding: theme.spacing(0, 0, 5, 0),
  },
  paymentTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats.white,
  },
  paymentTableFilterCancelButton: {
    border: 'none',
  },
  paymentsTableFilterForm: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
  },
  paymentsTableHeader: {
    borderBottom: `${theme.spacing(0.5)} solid ${
      theme.palette.stats.lavenderPinocchio
    }`,
  },
  paymentsTableFilterCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  paymentsTableFilterAvatar: {
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(2),
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
  paymentsFilterSelectFormControl: {
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
  const paymentTableDateFilter = paymentTableDateFilterStyles(theme);

  return { ...paymentTableDateFilter };
});

export default useStyles;
