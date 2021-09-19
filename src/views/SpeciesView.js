import React, { useEffect } from 'react';
import SpeciesTable from '../components/SpeciesTable';
import { Grid } from '@material-ui/core';
import { documentTitle } from '../common/variables';
import { SpeciesProvider } from '../context/SpeciesContext';

const SpeciesView = () => {
  /* to update html document title */
  useEffect(() => {
    document.title = `Species - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%' }}
    >
      <Grid item container style={{ height: '100%', overflow: 'hidden' }}>
        <SpeciesProvider>
          <SpeciesTable />
        </SpeciesProvider>
      </Grid>
    </Grid>
  );
};

export default SpeciesView;
