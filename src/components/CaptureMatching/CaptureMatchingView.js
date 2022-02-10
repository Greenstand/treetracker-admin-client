import React from 'react';
import CaptureMatchingProvider from 'context/CaptureMatchingContext';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CaptureMatichingTable from './CaptureMatchingTable';

const useStyle = makeStyles((theme) => ({
  container: {
    backgroundColor: '#E5E5E5',
    width: '100%',
    display: 'flex',
    height: 'calc(100vh - 43px)',
  },

  candidateImgIcon: {
    fontSize: '37px',
  },

  candidateIconBox: {},
  box1: {
    backgroundColor: '#F0F0F0',
    padding: theme.spacing(4, 4),
    width: '50%',
    height: '100%',
    boxSizing: 'border-box',
  },
  box2: {
    padding: theme.spacing(4, 4),
    width: '50%',
    overflow: 'auto',
  },
}));

function CaptureMatchingView() {
  const classes = useStyle();

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <CaptureMatchingProvider>
        <CaptureMatichingTable classes={classes} />
      </CaptureMatchingProvider>
    </Grid>
  );
}

export default CaptureMatchingView;
