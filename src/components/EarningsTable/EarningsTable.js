import Grid from '@material-ui/core/Grid';
import Navbar from '../Navbar';
import React from 'react';

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @param {object} props - component props
 * @param {object} props.earnings - earnings data
 *
 * @returns {React.Component} earnings table
 */
function EarningsTable() {
  return (
    <Grid container direction="column">
      <Grid item>
        <Navbar />
      </Grid>
      <Grid item>
        <h2>EarningsTable Works</h2>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
