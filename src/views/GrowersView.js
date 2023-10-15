import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import Growers from '../components/Growers/Growers.js';
import { GrowerProvider } from '../context/GrowerContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import GrowerFilterHeader from '../components/GrowerFilterHeader';

function GrowersView() {
  useEffect(() => {
    document.title = `Growers - ${documentTitle}`;
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <GrowerProvider searchParams={searchParams}>
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
