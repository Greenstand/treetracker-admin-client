import React, { useState, useEffect } from 'react';

// import TextField from '@material-ui/core/TextField';
import Navbar from './Navbar';
import { TextField, Grid, Button, TablePagination } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
import FilterIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';

export default function Stakeholder(props) {
  const handleFilterClick = () => {
    console.log('filter');
  };

  const handleSortClick = () => {
    console.log('sort');
  };

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Navbar />
        </Grid>
        <Grid item>
          <TextField id="outlined-basic" label="Search" variant="outlined" />
          <Button
            variant="text"
            color="primary"
            onClick={handleFilterClick}
            startIcon={<FilterIcon />}
            key={1}
          >
            Filter
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={handleSortClick}
            startIcon={<SortIcon />}
            key={1}
          >
            Sort
          </Button>
          <TablePagination
            // rowsPerPageOptions={[25, 50, 100, 250, 500]}
            component="div"
            count={200}
            page={1}
            // rowsPerPage={this.props.rowsPerPage}
            // onChangePage={this.handlePageChange}
            // onChangeRowsPerPage={this.handleRowsPerPageChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSortClick}
            key={1}
          >
            Add Stakeholder
          </Button>

          {/* <TreeTable /> */}
        </Grid>
      </Grid>
    </>
  );
}
