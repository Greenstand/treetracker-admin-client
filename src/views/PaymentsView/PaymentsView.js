import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Navbar from '../../components/Navbar';
import PaymentsTable from '../../components/PaymentsTable/PaymentsTable';
import { documentTitle } from '../../common/variables';

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
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <Navbar />
      <PaymentsTable />
    </Grid>
  );
}

export default PaymentsView;
