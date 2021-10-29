import React, { useState, useContext, useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid, Button } from '@material-ui/core';
import IconFilter from '@material-ui/icons/FilterList';
import { CapturesContext } from '../context/CapturesContext';
import Navbar from '../components/Navbar';
import FilterTop from '../components/FilterTop';

function FilterHeader() {
  const capturesContext = useContext(CapturesContext);
  const [isFilterShown, setFilterShown] = useState(true);

  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  const handleFilterSubmit = (filter) => {
    // console.log('1 - submitted filter', filter);
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
