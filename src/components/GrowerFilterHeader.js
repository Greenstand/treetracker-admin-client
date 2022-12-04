import { Button, Grid } from '@material-ui/core';
import React, { useContext, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import FilterTopGrower from './FilterTopGrower';
import { GrowerContext } from '../context/GrowerContext';
import IconFilter from '@material-ui/icons/FilterList';
import Navbar from './Navbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
  activeFilters: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginLeft: '0.75rem',
    backgroundColor: theme.palette.stats.green,
    fontSize: 'smaller',
    fontWeight: 'bold',
  },
}));

function GrowersFilterHeader(props) {
  const classes = useStyle(props);
  const growerContext = useContext(GrowerContext);
  const [isFilterShown, setFilterShown] = useState(true);
  const numFilters = growerContext.filter.countAppliedFilters();

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
            variant="outlined"
            color="primary"
            onClick={handleFilterClick}
            startIcon={<IconFilter />}
            key={1}
          >
            Filter
            {numFilters > 0 && (
              <Avatar className={classes.activeFilters}>{numFilters}</Avatar>
            )}
          </Button>,
        ]}
      >
        <FilterTopGrower
          isOpen={isFilterShown}
          onSubmit={handleFilterSubmit}
          filter={growerContext.filter}
          onClick={handleFilterClick}
        />
      </Navbar>
    </Grid>
  );
}

export default GrowersFilterHeader;
