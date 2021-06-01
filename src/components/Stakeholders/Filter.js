import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      margin: '4px',
      // width: '25ch',
    },
  },
  flex: {
    display: 'flex',
  },
  ml: {
    marginLeft: '24px',
  },
});

function Filter({ state, dispatch }) {
  const { filters } = state;
  const { updateFilters } = dispatch;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});

  const close = () => {
    setOptions(filters);
    setOpen(false);
  };

  const updateOptions = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setOptions({});
    updateFilters({});
  };

  const applyFilters = () => {
    updateFilters({ ...filters, ...options });
    setOpen(false);
  };

  const applySearch = (e) => {
    updateFilters({ ...filters, search: e.target.value });
  };

  return (
    <>
      <TextField
        id="search"
        name="search"
        label="Search"
        variant="outlined"
        value={filters?.search || ''}
        onChange={applySearch}
        autoComplete="off"
      />
      <Button
        variant="text"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<FilterIcon />}
        className={classes.ml}
      >
        Filter
      </Button>
      {Object.keys(filters).length > 0 && (
        <Button onClick={resetFilters}>Reset Filters</Button>
      )}
      <Dialog open={open} onClose={close} fullWidth={true} maxWidth={'md'}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <FormControl className={classes.root}>
            <div className={classes.flex}>
              <TextField
                label="ID"
                variant="outlined"
                name="id"
                onChange={updateOptions}
                value={options?.id || ''}
              />
              <TextField
                label="Organization Name"
                variant="outlined"
                name="name"
                onChange={updateOptions}
                value={options?.name || ''}
              />
              <TextField
                label="Map"
                variant="outlined"
                name="map"
                onChange={updateOptions}
                value={options?.map || ''}
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                onChange={updateOptions}
                value={options?.email || ''}
              />
              <TextField
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={updateOptions}
                value={options?.phone || ''}
              />
              <TextField
                label="Website"
                variant="outlined"
                name="website"
                onChange={updateOptions}
                value={options?.website || ''}
              />
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={applyFilters}>
            Apply
          </Button>
          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default connect(
  //state
  (state) => ({
    state: state.stakeholders,
  }),
  //dispatch
  (dispatch) => ({
    dispatch: dispatch.stakeholders,
  }),
)(Filter);
