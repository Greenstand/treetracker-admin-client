import { makeStyles } from '@material-ui/core/styles';

/**
 * @function
 * @name customTableFilterStyles
 * @description styles for CustomTableFilter component
 * @param {object} theme - material-ui theme object
 * @returns {object} styles object
 */
const customTableFilterStyles = (theme) => ({
  customTableFilterHeader: {
    padding: theme.spacing(0, 0, 5, 0),
  },
  customTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats?.white,
  },
  customTableFilterResetButton: {
    border: 'none',
  },
  customTableFilterForm: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
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
  customTableFilterSelectFormControl: {
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
  const customTableFilter = customTableFilterStyles(theme);

  return { ...customTableFilter };
});

export default useStyles;
