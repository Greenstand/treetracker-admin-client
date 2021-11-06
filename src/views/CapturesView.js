import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import CaptureTable from '../components/Captures/CaptureTable.js';
import { CapturesProvider } from '../context/CapturesContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import CaptureFilterHeader from '../components/CaptureFilterHeader';

function CapturesView() {
  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <CapturesProvider>
        <SpeciesProvider>
          <TagsProvider>
            <CaptureFilterHeader />
            <CaptureTable />
          </TagsProvider>
        </SpeciesProvider>
      </CapturesProvider>
    </Grid>
  );
}

export default CapturesView;
