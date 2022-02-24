import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Navbar from '../../components/Navbar';
import EarningsTable from '../../components/EarningsTable/EarningsTable';
import { documentTitle } from '../../common/variables';

/**
 * @function
 * @name EarningsView
 * @description View for the earnings page
 *
 * @returns {React.Component}
 */
function EarningsView() {
  useEffect(() => {
    document.title = `Earnings - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <Navbar />
      <EarningsTable />
    </Grid>
  );
}

export default EarningsView;
