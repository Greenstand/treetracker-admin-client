import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name earningDetailsStyles
 * @description styling for earning details component
 * @params {object} theme - material ui theme object
 * @returns {object} - styling object
 */
const earningDetailsStyles = (theme) => ({
  earningDetailsContents: {
    padding: theme.spacing(5, 0, 0, 0),
  },
  earningGrowerDetail: {
    padding: theme.spacing(1, 0, 0, 0),
    color: theme.palette.stats.carbonGrey,
  },
  earningDetailsContentsDivider: {
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
  const earningDetails = earningDetailsStyles(theme);

  return {
    ...earningDetails,
  };
});

export default useStyles;
