import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { Grid } from '@material-ui/core';
import Navbar from '../../components/Navbar';
import ContractsTable from '../../components/Contracts/ContractsTable';
import ContractAgreementsTable from '../../components/Contracts/ContractAgreementsTable';
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
      <Switch>
        <Route path="/agreements">
          <ContractAgreementsTable />
        </Route>
        <Route path="/contracts">
          <ContractsTable />
        </Route>
      </Switch>
    </Grid>
  );
}

export default ContractsView;
