import Grid from '@material-ui/core/Grid';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import styles from './EarningsTable.styles';
import Menu from '../common/Menu';

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

export default withStyles(styles)(EarningsTable);
