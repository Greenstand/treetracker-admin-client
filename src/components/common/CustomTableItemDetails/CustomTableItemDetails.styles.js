import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name itemDetailsStyles
 * @description styling for custom table item details component
 * @params {object} theme - material ui theme object
 * @returns {object} - styling object
 */
const itemDetailsStyles = (theme) => ({
  itemDrawerDetails: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
  },
  itemLogPaymentFormSelectFormControl: {
    margin: theme.spacing(2, 0, 2, 0),
    width: '100%',
  },
  itemDetailsCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  itemDetailsContents: {
    padding: theme.spacing(5, 0, 0, 0),
  },
  itemGrowerDetail: {
    padding: theme.spacing(1, 0, 0, 0),
    color: theme.palette.stats.carbonGrey,
  },
  itemDetailsContentsDivider: {
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
  const itemDetails = itemDetailsStyles(theme);

  return {
    ...itemDetails,
  };
});

export default useStyles;
