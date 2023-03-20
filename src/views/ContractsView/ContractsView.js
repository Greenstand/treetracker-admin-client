import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Navbar from '../../components/Navbar';
import ContractsTable from '../../components/Contracts/ContractsTable';
import { documentTitle } from '../../common/variables';

/**
 * @function
 * @name ContractsView
 * @description View for the earnings page
 *
 * @returns {React.Component}
 */
function ContractsView() {
  useEffect(() => {
    document.title = `Contracts - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%' }}
    >
      <Navbar />
      <ContractsTable />
    </Grid>
  );
}

export default ContractsView;
