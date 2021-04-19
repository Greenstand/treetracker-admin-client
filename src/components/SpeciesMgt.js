import React, { useEffect } from 'react';
import SpeciesTable from './SpeciesTable';
import { Grid } from '@material-ui/core';
import { documentTitle } from '../common/variables';

const SpeciesMgt = () => {
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
        <SpeciesTable />
      </Grid>
    </Grid>
  );
};

export default SpeciesMgt;
