/*
Captures

Captures is a container component (no visual representation of its own and concerned with
handling the comms between the captures view components and the store/models)

*/
import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import CaptureTable from '../components/CaptureTable';
import { CapturesProvider } from '../context/CapturesContext';

function CapturesView() {
  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%' }}
    >
      <Grid item container style={{ height: '100%', overflow: 'hidden' }}>
        <CapturesProvider>
          <CaptureTable />
        </CapturesProvider>
      </Grid>
    </Grid>
  );
}

export default CapturesView;
