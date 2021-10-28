import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useStyles from './EarningsTable.styles';
import Menu from '../common/Menu';

/**
 * @function
 * @name EarningsLeftMenu
 * @description renders left menu
 *
 * @param {Object} props - component props
 * @param {Object} props.classes - component css classes
 * @returns {React.Component} left menu
 */
function EarningsLeftMenu(props) {
  const classes = useStyles();
  return (
    <Grid item xs={2}>
      <Paper elevation={3} className={classes.menu}>
        <Menu variant="plain" />
      </Paper>
    </Grid>
  );
}

/**
 * @function
 * @name EarningsTableTopar
 * @description renders earnings table top bar
 *
 * @param {Object} props - component props
 * @returns
 */
function EarningsTableTopar(props) {
  const classes = useStyles();
  return (
    <Grid item className={classes.earningsTableTopBarTitle}>
      <Typography variant="h2">Earnings</Typography>
    </Grid>
  );
}

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
  const classes = useStyles();
  return (
    <Grid container direction="row">
      <EarningsLeftMenu />
      <EarningsTableTopar />
    </Grid>
  );
}

export default EarningsTable;
