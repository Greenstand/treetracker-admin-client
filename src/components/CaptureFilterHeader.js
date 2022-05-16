import React, { useState, useContext } from 'react';
// import { SIDE_PANEL_WIDTH } from '../common/variables.js';
import { Grid, Button } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import TableChartIcon from '@material-ui/icons/TableChart';
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

function CaptureFilterHeader({ showGallery, setShowGallery }) {
  const classes = useStyle();
  const { filter, updateFilter } = useContext(CapturesContext);
  const [isFilterShown, setFilterShown] = useState(true);
  const numFilters = filter.countAppliedFilters();

  const handleFilterSubmit = (filter) => {
    updateFilter(filter);
  };

  const handleFilterClick = () => {
    setFilterShown(!isFilterShown);
  };

  return (
    <Grid item>
      <Navbar
        // sidepanelWidth={showGallery ? SIDE_PANEL_WIDTH : 0}
        buttons={[
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowGallery(false)}
            startIcon={<TableChartIcon />}
            key={1}
            disabled={!showGallery}
          >
            Table View
          </Button>,
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowGallery(true)}
            startIcon={<ImageIcon />}
            key={2}
            disabled={showGallery}
          >
            Gallery View
          </Button>,
          <Button
            variant="outlined"
            color="primary"
            onClick={handleFilterClick}
            startIcon={<IconFilter />}
            key={3}
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
            filter={filter}
            onClick={handleFilterClick}
          />
        )}
      </Navbar>
    </Grid>
  );
}

export default CaptureFilterHeader;
