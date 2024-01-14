import { makeStyles } from '@material-ui/core/styles';
import { MENU_WIDTH } from '../../components/common/Menu';

/**
 * @constant
 * @name earningsViewStyles
 * @description styles for earnings view
 * @type {object}
 */
const earningsViewLeftMenu = {
  earningsViewLeftMenu: {
    height: '100%',
    width: MENU_WIDTH,
  },
};

/**
 * @constant
 * @name earningsViewStyles
 * @description styles for earnings view
 * @type {object}
 */
const earningsViewStyles = {};

/**
 * @function
 * @name useStyles
 * @description combines and makes styles for earnings view component
 *
 * @returns {object} earnings view styles
 */
const useStyles = makeStyles(() => ({
  ...earningsViewStyles,
  ...earningsViewLeftMenu,
}));

export default useStyles;
