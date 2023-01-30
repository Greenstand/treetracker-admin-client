import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import Growers from '../components/Growers/Growers.js';
import { GrowerProvider } from '../context/GrowerContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import GrowerFilterHeader from '../components/GrowerFilterHeader';

function GrowersView({ search }) {
  useEffect(() => {
    document.title = `Growers - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <GrowerProvider search={search}>
        <SpeciesProvider>
          <TagsProvider>
            <GrowerFilterHeader />
            <Growers />
          </TagsProvider>
        </SpeciesProvider>
      </GrowerProvider>
    </Grid>
  );
}

export default GrowersView;
