import { MENU_WIDTH } from '../common/Menu';
import { makeStyles } from '@material-ui/core/styles';

/**
 * @object
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  earningsTableTopBarTitle: {
    padding: '25px 0 25px 0',
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
 * @object
 * @name EarningsTableStyles
 * @description styles for EarningsTableStyles component
 */
const earningsTableStyles = {
  earningsTableRightContents: {
    width: '80%',
  },

  earningsTableHeader: {
    borderBottom: '2px solid #e0e0e0',
  },

  infoIcon: {
    color: '#86C232',
    position: 'absolute',
    top: '11.6%',
    right: '3%',
  },

  root: {
    borderBottom: 'none',
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
  ...earningsTableStyles,
}));

export default useStyles;
