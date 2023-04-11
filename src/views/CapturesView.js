import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import CaptureTable from '../components/Captures/CaptureTable';
import { CapturesProvider } from '../context/CapturesContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import CaptureFilterHeader from '../components/CaptureFilterHeader';
import { GrowerProvider } from 'context/GrowerContext';

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
            <GrowerProvider>
              <CaptureFilterHeader />
              <CaptureTable />
            </GrowerProvider>
          </TagsProvider>
        </SpeciesProvider>
      </CapturesProvider>
    </Grid>
  );
}

export default CapturesView;
