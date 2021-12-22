import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';
// import FilterModel from '../../models/FilterStakeholder';
import FilterModel, {
  ALL_ORGANIZATIONS,
  ORGANIZATION_NOT_SET,
} from '../../models/FilterStakeholder';
import { AppContext } from '../../context/AppContext';
import { StakeholdersContext } from '../../context/StakeholdersContext';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      margin: '4px',
      width: '25ch',
    },
  },
  flex: {
    display: 'flex',
    flex: 'wrap',
  },
  ml: {
    marginLeft: '24px',
  },
});

function StakeholderFilter() {
  const classes = useStyles();
  const { orgList, userHasOrg } = useContext(AppContext);

  const { filter, updateFilter, initialFilterState } = useContext(
    StakeholdersContext,
  );
  const [organizationId, setOrganizationId] = useState(
    filter.id || ALL_ORGANIZATIONS,
  );
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(initialFilterState);
  const [open, setOpen] = useState(false);

  const close = () => {
    setFormData(filter);
    setOpen(false);
  };

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFormData(initialFilterState);
    const resetFilter = new FilterModel(initialFilterState);
    updateFilter(resetFilter);
  };

  const applyFilters = () => {
    const resetFilter = new FilterModel({
      ...filter,
      ...formData,
    });
    updateFilter(resetFilter);
    setOpen(false);
  };

  const applySearch = (e) => {
    setSearch(e.target.value);
    const resetFilter = new FilterModel({ ...filter, search: e.target.value });
    updateFilter(resetFilter);
  };

  const defaultOrgList = userHasOrg
    ? [
        {
          id: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
      ]
    : [
        {
          id: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
        {
          id: ORGANIZATION_NOT_SET,
          name: 'Not set',
          value: null,
        },
      ];

  const defaultTypeList = [
    {
      name: 'Not set',
      value: undefined,
    },
    {
      name: 'Organization',
      value: 'Organization',
    },
    {
      name: 'Person',
      value: 'Person',
    },
  ];

  return (
    <>
      <TextField
        id="search"
        name="search"
        label="Search"
        variant="outlined"
        value={search || ''}
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
      {Object.keys(filter).length > 0 && (
        <Button onClick={resetFilters}>Reset Filters</Button>
      )}
      <Dialog open={open} onClose={close} fullWidth={true} maxWidth={'md'}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <FormControl className={classes.root}>
            <TextField
              label="ID"
              variant="outlined"
              name="id"
              onChange={handleChanges}
              value={formData.id}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="type-dropdown"
              select
              label="type"
              htmlFor="type"
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) => handleChanges(e)}
            >
              {defaultTypeList.map((type) => (
                <MenuItem
                  data-testid="type-item"
                  key={type.name}
                  value={type.value}
                >
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="org-dropdown"
              select
              label="Organization"
              htmlFor="organization"
              id="organizationId"
              name="organization_id"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            >
              {[...defaultOrgList, ...orgList].map((org) => (
                <MenuItem data-testid="org-item" key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            {/* <TextField
                label="Org Name"
                variant="outlined"
                name="org_name"
                onChange={handleChanges}
                value={formData.org_name}
              />
              <TextField
                label="First Name"
                variant="outlined"
                name="first_name"
                onChange={handleChanges}
                value={formData.first_name}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                name="last_name"
                onChange={handleChanges}
                value={formData.last_name}
              /> */}
            <TextField
              label="Map"
              variant="outlined"
              name="map"
              onChange={handleChanges}
              value={formData.map}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              onChange={handleChanges}
              value={formData.email}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              onChange={handleChanges}
              value={formData.phone}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              label="Website"
              variant="outlined"
              name="website"
              onChange={handleChanges}
              value={formData.website}
            />
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

export default StakeholderFilter;
