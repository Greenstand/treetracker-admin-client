import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <CapturesProvider searchParams={searchParams}>
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
