import React, { useState, useContext } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconFilter from '@material-ui/icons/FilterList';
import { CapturesContext } from '../context/CapturesContext';
import Navbar from './Navbar';
import CaptureFilter from './CaptureFilter';

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

function CaptureFilterHeader(props) {
  const classes = useStyle(props);
  const capturesContext = useContext(CapturesContext);
  const [isFilterShown, setFilterShown] = useState(true);
  const numFilters = capturesContext.filter.countAppliedFilters();

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
        {isFilterShown && (
          <CaptureFilter
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

export default CaptureFilterHeader;
