import React, { useEffect } from 'react';
import Regions from '../components/Regions';
import { Grid } from '@material-ui/core';
import { documentTitle } from '../common/variables';
import { RegionProvider } from '../context/RegionContext';

const RegionsView = () => {
  /* to update html document title */
  useEffect(() => {
    document.title = `Regions - ${documentTitle}`;
  }, []);

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%' }}
    >
      <Grid item container style={{ height: '100%' }}>
        <RegionProvider>
          <Regions />
        </RegionProvider>
      </Grid>
    </Grid>
  );
};

export default RegionsView;
