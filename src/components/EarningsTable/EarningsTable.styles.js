import { MENU_WIDTH } from '../common/Menu';
import { makeStyles } from '@material-ui/core/styles';

/**
 * @constant
 * @type {object}
 * @description possible colors for earning table component
 * @see {@link https://colors.artyclick.com/color-name-finder/}  - to learn how
 *  color names are generated
 */
const COLORS = {
  appleGreen: '#86C232',
  lavenderPinocchio: '#E0E0E0',
};

/**
 * @constant
 * @type {object}
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  earningsTableTopBarTitle: {
    // padding: '25px 0 25px 0',
  },
  actionButton: {
    color: COLORS.appleGreen,
  },
  actionButtonIcon: {
    position: 'relative',
    top: '4px',
  },
  topBarActions: {
    width: '60%',
  },
};

/**
 * @constant
 * @type {object}
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
 * @constant
 * @type {object}
 * @name EarningsTableStyles
 * @description styles for EarningsTableStyles component
 */
const earningsTableStyles = {
  earningsTableRightContents: {
    width: '80%',
  },

  earningsTableHeader: {
    borderBottom: `2px solid ${COLORS.lavenderPinocchio}`,
  },

  infoIcon: {
    color: `${COLORS.appleGreen}`,
    position: 'relative',
    top: '5px',
    left: '5px',
  },

  root: {
    border: 'none',
  },
  selectRoot: {
    marginRight: '76%',
    position: 'relative',
    right: '10%',
    border: `1px solid ${COLORS.lavenderPinocchio}`,
    borderRadius: '3px',
    padding: '4px',
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
