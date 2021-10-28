import { MENU_WIDTH } from '../common/Menu';
import { makeStyles } from '@material-ui/core/styles';

/**
 * @object
 * @name EarningsTableTopBarStyles
 * @description styles for EarningsTableTopBar component
 */
const earningsTableTopBarStyles = {
  earningsTableTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dowloadButton: {
    color: '#86C232',
  },

  earningsTableTopBarRight: {
    width: '60%',
    height: '100%',
  },
};

/**
 * @object
 * @name EarningsTableStyles
 * @description styles for EarningsTable component
 */
const earningsTableStyles = {
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  menuAside: {
    height: '100%',
    width: MENU_WIDTH,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  menu: {
    height: '100%',
    width: MENU_WIDTH,
    overflow: 'hidden',
  },
  rightBox: {
    height: '100%',
    position: 'absolute',
    padding: '40px',
    left: MENU_WIDTH,
    top: 0,
    right: 0,
    backgroundColor: 'rgb(239, 239, 239)',
    boxSizing: 'border-box',
  },
};

/**
 * @function
 * @name useStyles
 * @description hook that combines all the styles
 * @returns {object} styles
 */
const useStyles = makeStyles(() => ({
  ...earningsTableStyles,
  ...earningsTableTopBarStyles,
}));

export default useStyles;
