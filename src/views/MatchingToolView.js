import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import { MatchingToolProvider } from 'context/MatchingToolContext';
import CaptureMatchingView from 'components/CaptureMatching/CaptureMatchingView';

function GrowersView() {
  useEffect(() => {
    document.title = `Matching Tool - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <MatchingToolProvider>
        <CaptureMatchingView />
      </MatchingToolProvider>
    </Grid>
  );
}

export default GrowersView;
