import React, { useState } from 'react';
import StakeholderTable from './Table';
import FilterBar from './FilterBar';
import Navbar from '../Navbar';
import { Grid, Container } from '@material-ui/core';

const rows = [
  {
    type: 'org',
    name: 'Greenstand',
    id: '1',
    map: '/dsf1',
    email: 'a@g.com',
    phone: '1234',
    website: 'adsfqwe.com',
    children: [
      {
        type: 'person',
        name: 'Child',
        id: '2',
        map: '/dsf2',
        email: 'a@g.com',
        phone: '1234',
        website: 'adsfqwe.com',
      },
      {
        type: 'person',
        name: 'Child 2',
        id: '3',
        map: '/dsf3',
        email: 'a@g.com',
        phone: '1234',
        website: 'adsfqwe.com',
      },
    ],
  },
  {
    type: 'org',
    name: 'Greenstand2',
    id: '4',
    map: '/dsf4',
    email: 'a@g.com',
    phone: '1234',
    website: 'adsfqwe.com',
    children: [],
  },
  {
    type: 'org',
    name: 'Greenstand3',
    id: '5',
    map: '/dsf5',
    email: 'a@g.com',
    phone: '1234',
    website: 'adsfqwe.com',
    children: [],
  },
  {
    type: 'org',
    name: 'Greenstand4',
    id: '6',
    map: '/dsf6',
    email: 'a@g.com',
    phone: '1234',
    website: 'adsfqwe.com',
    children: [],
  },
];

export default function Stakeholders() {
  const [data, setData] = useState(rows);

  return (
    <>
      <Grid container direction="column">
        <Navbar />
        <Container>
          <FilterBar />
          <StakeholderTable data={data} />
        </Container>
      </Grid>
    </>
  );
}
