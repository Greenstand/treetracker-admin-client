import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import Growers from '../components/Growers/Growers.js';
import { GrowersProvider } from '../context/GrowersContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import GrowersFilterHeader from '../components/GrowersFilterHeader';

function GrowersView() {
  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <GrowersProvider>
        <SpeciesProvider>
          <TagsProvider>
            <GrowersFilterHeader />
            <Growers />
          </TagsProvider>
        </SpeciesProvider>
      </GrowersProvider>
    </Grid>
  );
}

export default GrowersView;
