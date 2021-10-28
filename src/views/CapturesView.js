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
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';

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
      <CapturesProvider>
        <SpeciesProvider>
          <TagsProvider>
            <CaptureTable />
          </TagsProvider>
        </SpeciesProvider>
      </CapturesProvider>
    </Grid>
  );
}

export default CapturesView;
