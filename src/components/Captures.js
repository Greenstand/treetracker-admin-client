/*
Captures

Captures is a container component (no visual representation of its own and concerned with
handling the comms between the captures view components and the store/models)

*/
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { documentTitle } from '../common/variables';
import Grid from '@material-ui/core/Grid';

import Navbar from './Navbar';
import CaptureTable from './CaptureTable';

function Captures() {
  /* to update html document title */
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
        <CaptureTable />
      </Grid>
    </Grid>
  );
}

const mapState = (state) => {
  return { state: state };
};

const mapDispatch = () => {
  return {};
};

Captures.propTypes = {};

export default connect(mapState, mapDispatch)(Captures);
