import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import Growers from '../components/Growers/Growers.js';
import { GrowerProvider } from '../context/GrowerContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { MessagingProvider } from 'context/MessagingContext';
import { TagsProvider } from '../context/TagsContext';
import GrowerFilterHeader from '../components/GrowerFilterHeader';
function GrowersView() {
  useEffect(() => {
    document.title = `Growers - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <MessagingProvider>
        <GrowerProvider>
          <SpeciesProvider>
            <TagsProvider>
              <GrowerFilterHeader />
              <Growers />
            </TagsProvider>
          </SpeciesProvider>
        </GrowerProvider>
      </MessagingProvider>
    </Grid>
  );
}

export default GrowersView;
