import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import EarningsTable from '../../components/EarningsTable/EarningsTable';
import { documentTitle } from '../../common/variables';
import Menu from '../../components/common/Menu';
import useStyles from './PaymentsView.styles';

/**
 * @function
 * @name PaymentsLeftMenu
 * @description renders left menu
 *
 * @returns {React.Component} left menu
 */
function PaymentsLeftMenu() {
  const classes = useStyles();

  return (
    <>
      <Paper elevation={3} className={classes.earningsViewLeftMenu}>
        <Menu variant="plain" />
      </Paper>
    </>
  );
}

/**
 * @function
 * @name PaymentsView
 * @description View for the earnings page
 *
 * @returns {React.Component}
 */
function PaymentsView() {
  useEffect(() => {
    document.title = `Payments - ${documentTitle}`;
  }, []);
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item xs={2}>
        <PaymentsLeftMenu />
      </Grid>
      <Grid item xs={10}>
        <EarningsTable />
      </Grid>
    </Grid>
  );
}

export default PaymentsView;
