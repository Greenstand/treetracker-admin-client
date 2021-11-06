import React, { useState, useContext } from 'react';
import { Grid, Button } from '@material-ui/core';
import IconFilter from '@material-ui/icons/FilterList';
import { GrowerContext } from '../context/GrowerContext';
import Navbar from './Navbar';
import FilterTopGrower from './FilterTopGrower';

function GrowersFilterHeader() {
  const growerContext = useContext(GrowerContext);
  const [isFilterShown, setFilterShown] = useState(true);

  const handleFilterSubmit = (filter) => {
    growerContext.updateFilter(filter);
  };

  const handleFilterClick = () => {
    setFilterShown(!isFilterShown);
  };

  return (
    <Grid item>
      <Navbar
        buttons={[
          <Button
            variant="text"
            color="primary"
            onClick={handleFilterClick}
            startIcon={<IconFilter />}
            key={1}
          >
            Filter
          </Button>,
        ]}
      >
        {isFilterShown && (
          <FilterTopGrower
            isOpen={isFilterShown}
            onSubmit={handleFilterSubmit}
            filter={growerContext.filter}
            onClick={handleFilterClick}
          />
        )}
      </Navbar>
    </Grid>
  );
}

export default GrowersFilterHeader;
