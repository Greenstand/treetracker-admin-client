import { Container, Grid } from '@material-ui/core';

import FilterBar from '../components/Stakeholders/FilterBar';
import { GrowerProvider } from '../context/GrowerContext';
import Navbar from '../components/Navbar';
import React from 'react';
import StakeholderTable from '../components/Stakeholders/Table';
import { StakeholdersProvider } from '../context/StakeholdersContext';

export default function Stakeholders() {
  return (
    <Grid container direction="column">
      <StakeholdersProvider>
        <GrowerProvider>
          <Navbar />
          <Container>
            <FilterBar />
            <StakeholderTable />
          </Container>
        </GrowerProvider>
      </StakeholdersProvider>
    </Grid>
  );
}
