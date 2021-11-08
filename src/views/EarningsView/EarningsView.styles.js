import { makeStyles } from '@material-ui/core/styles';

/**
 * @constant
 * @name earningsViewStyles
 * @description styles for earnings view
 * @type {object}
 */
const earningsViewLeftMenu = {
  earningsViewLeftMenu: {
    height: '100%',
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
