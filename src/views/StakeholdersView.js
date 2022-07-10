import React from 'react';
import { GrowerProvider } from '../context/GrowerContext';
import { StakeholdersProvider } from '../context/StakeholdersContext';
import StakeholderTable from '../components/Stakeholders/Table';
import FilterBar from '../components/Stakeholders/FilterBar';
import Navbar from '../components/Navbar';
import { Grid, Container } from '@material-ui/core';

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
