import React, { useState, useContext } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconFilter from '@material-ui/icons/FilterList';
import { GrowerContext } from '../context/GrowerContext';
import Navbar from './Navbar';
import FilterTopGrower from './FilterTopGrower';

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

function GrowerFilterHeader(props) {
  const classes = useStyle(props);
  const { filter } = useContext(GrowerContext);
  const [isFilterShown, setFilterShown] = useState(true);
  const numFilters = filter.countAppliedFilters();

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
        {isFilterShown && <FilterTopGrower onClick={handleFilterClick} />}
      </Navbar>
    </Grid>
  );
}

export default GrowerFilterHeader;
