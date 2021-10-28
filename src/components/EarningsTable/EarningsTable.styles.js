import { MENU_WIDTH } from '../common/Menu';
import { makeStyles } from '@material-ui/core/styles';

/**
 * @object
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  earningsTableTopBarTitle: {
    paddingTop: '25px',
  },
};

/**
 * @object
 * @name EarningsLeftMenu
 * @description styles for EarningsLeftMenu component
 */
const earningsLeftMenuStyles = {
  menu: {
    height: '100%',
    width: MENU_WIDTH,
    overflow: 'hidden',
  },
};

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles(() => ({
  ...earningsLeftMenuStyles,
  ...earningsTableTopBarStyles,
}));

export default useStyles;
