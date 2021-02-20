/*
Trees

Trees is a container component (no visual representation of its own and concerned with
handling the comms between the tree view components and the store/models)

*/
import React from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Navbar from './Navbar';
import TreeTable from './TreeTable';

function Trees(props) {
  return (
    <Grid container direction="column" style={{flexWrap: 'nowrap', height: '100%' }}>
      <Grid item>
        <Navbar />
      </Grid>
      <Grid item container style={{height: '100%', overflow: 'hidden'}}>
        <TreeTable />
      </Grid>
    </Grid>
  )
}

const mapState = state => {
  return { state: state }
}

const mapDispatch = dispatch => {
  return {}
}

Trees.propTypes = {}

export default connect(
  mapState,
  mapDispatch
)(Trees)
