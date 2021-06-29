/*
Captures

Captures is a container component (no visual representation of its own and concerned with
handling the comms between the captures view components and the store/models)

*/
import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
// import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Navbar from './Navbar';
import CaptureTable from './CaptureTable';
import { CapturesProvider } from '../context/CapturesContext';

function Captures() {
  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%' }}
    >
      <Grid item>
        <Navbar />
      </Grid>
      <Grid item container style={{ height: '100%', overflow: 'hidden' }}>
        <CapturesProvider>
          <CaptureTable />
        </CapturesProvider>
      </Grid>
    </Grid>
  );
}

export default Captures;
