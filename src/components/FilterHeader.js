import React, { useState, useContext } from 'react';
import { Grid, Button } from '@material-ui/core';
import IconFilter from '@material-ui/icons/FilterList';
import { CapturesContext } from '../context/CapturesContext';
import Navbar from '../components/Navbar';
import FilterTop from '../components/FilterTop';

function FilterHeader() {
  const capturesContext = useContext(CapturesContext);
  const [isFilterShown, setFilterShown] = useState(true);

  const handleFilterSubmit = (filter) => {
    capturesContext.updateFilter(filter);
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
          <FilterTop
            isOpen={isFilterShown}
            onSubmit={handleFilterSubmit}
            filter={capturesContext.filter}
            onClick={handleFilterClick}
          />
        )}
      </Navbar>
    </Grid>
  );
}

export default FilterHeader;
