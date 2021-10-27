import Grid from '@material-ui/core/Grid';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Menu, { MENU_WIDTH } from '../common/Menu';

/**
 * @function
 * @name styles
 * @description styles for EarningsTable component
 *
 * @returns {Object} css classes
 */
const style = () => ({
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
});

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @param {object} props - component props
 * @param {object} props.earnings - earnings data
 * @param {object} props.classes - css classes
 *
 * @returns {React.Component} earnings table
 */
function EarningsTable(props) {
  const { classes } = props;
  return (
    <div className={classes.box}>
      <div className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </div>
      <div className={classes.rightBox}>
        <Grid item>
          <h2>EarningsTable Works</h2>
        </Grid>
      </div>
    </div>
  );
}

export default withStyles(style)(EarningsTable);
