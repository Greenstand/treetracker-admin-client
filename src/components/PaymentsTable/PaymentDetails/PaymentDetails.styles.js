import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name paymentDetailsStyles
 * @description styling for payment details component
 * @params {object} theme - material ui theme object
 * @returns {object} - styling object
 */
const paymentDetailsStyles = (theme) => ({
  paymentsDrawerDetails: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
  },
  paymentsLogPaymentFormSelectFormControl: {
    margin: theme.spacing(2, 0, 2, 0),
    width: '100%',
  },
  paymentDetailsCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  paymentDetailsContents: {
    padding: theme.spacing(5, 0, 0, 0),
  },
  paymentGrowerDetail: {
    padding: theme.spacing(1, 0, 0, 0),
    color: theme.palette.stats.carbonGrey,
  },
  paymentDetailsContentsDivider: {
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
  const paymentDetails = paymentDetailsStyles(theme);

  return {
    ...paymentDetails,
  };
});

export default useStyles;
