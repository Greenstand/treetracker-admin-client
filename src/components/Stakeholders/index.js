import React from 'react';
import StakeholderTable from './Table';
import FilterBar from './FilterBar';
import Navbar from '../Navbar';
import { Grid, Container } from '@material-ui/core';

export default function Stakeholders() {
  return (
    <>
      <Grid container direction="column">
        <Navbar />
        <Container>
          <FilterBar />
          <StakeholderTable />
        </Container>
      </Grid>
    </>
  );
}
