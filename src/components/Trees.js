/*
Trees

Trees is a container component (no visual representation of its own and concerned with
handling the comms between the tree view components and the store/models)

*/
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { documentTitle } from '../common/variables';
import Grid from '@material-ui/core/Grid';

import Navbar from './Navbar';
import TreeTable from './TreeTable';

function Trees() {
  /* to update html document title */
  useEffect(() => {
    document.title = `Trees - ${documentTitle}`;
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
        <TreeTable />
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

Trees.propTypes = {};

export default connect(mapState, mapDispatch)(Trees);
