import React, { useState, useContext, useEffect } from 'react';
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
import FilterModel from '../../models/FilterStakeholder';
import { ALL_ORGANIZATIONS } from '../../models/FilterStakeholder';
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
  const { orgList } = useContext(AppContext);
  const { stakeholders, filter, updateFilter, initialFilterState } = useContext(
    StakeholdersContext
  );
  const [formData, setFormData] = useState(initialFilterState);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const orgNames = new Set(['']);
  const firstNames = new Set(['']);
  const lastNames = new Set(['']);
  const emails = new Set(['']);
  const phones = new Set(['']);
  const websites = new Set(['']);
  const maps = new Set(['']);

  // create filter lists
  useEffect(() => {
    stakeholders.forEach((org) => {
      org.org_name && orgNames.add(org.org_name);
      org.first_name && firstNames.add(org.first_name);
      org.last_name && lastNames.add(org.last_name);
      org.email && emails.add(org.email);
      org.phone && phones.add(org.phone);
      org.website && websites.add(org.website);
      org.map && maps.add(org.map);
    });
    setFilters({
      orgNames: Array.from(orgNames).sort(),
      firstNames: Array.from(firstNames).sort(),
      lastNames: Array.from(lastNames).sort(),
      emails: Array.from(emails).sort(),
      phones: Array.from(phones).sort(),
      websites: Array.from(websites).sort(),
      maps: Array.from(maps).sort(),
    });
  }, [stakeholders.length]);

  const close = () => {
    setFormData(filter);
    setOpen(false);
  };

  const handleChanges = (e) => {
    const key = e.target.name === 'organization_id' ? 'id' : e.target.name;
    const value =
      e.target.name === 'organization_id'
        ? orgList.find((o) => o.stakeholder_uuid === e.target.value)
            ?.stakeholder_uuid || null
        : e.target.value !== 'Not Set'
        ? e.target.value
        : '';
    setFormData({ ...formData, [key]: value });
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && applyFilters(e);
  };

  const resetFilters = () => {
    setFormData(initialFilterState);
    const resetFilter = new FilterModel(initialFilterState);
    updateFilter(resetFilter);
  };

  const applyFilters = () => {
    const newFilter = new FilterModel({
      ...filter,
      ...formData,
    });
    updateFilter(newFilter);
    setOpen(false);
  };

  const defaultOrgList = [
    {
      id: ALL_ORGANIZATIONS,
      name: 'All',
      value: '',
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
        value={formData.search}
        onChange={handleChanges}
        autoComplete="off"
        onKeyDown={handleEnterPress}
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
              data-testid="type-dropdown"
              select
              label="Type"
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
              value={formData.id}
              onChange={handleChanges}
            >
              {[...defaultOrgList, ...orgList].map((org) => (
                <MenuItem
                  data-testid="org-item"
                  key={org.id}
                  value={org.stakeholder_uuid}
                >
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              label="Organization ID"
              variant="outlined"
              name="id"
              onChange={handleChanges}
              value={formData.id}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              label="Org Name"
              variant="outlined"
              name="org_name"
              onChange={handleChanges}
              value={formData.org_name}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="firstName-dropdown"
              select
              label="First Name"
              htmlFor="first_name"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChanges}
            >
              {filters?.firstNames?.map((option) => (
                <MenuItem data-testid="first_name" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="lastName-dropdown"
              select
              label="Last Name"
              htmlFor="last_name"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChanges}
            >
              {filters?.lastNames?.map((option) => (
                <MenuItem data-testid="last_name" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="map-dropdown"
              select
              label="Map"
              htmlFor="map"
              id="map"
              name="map"
              value={formData.map}
              onChange={handleChanges}
            >
              {filters?.maps?.map((option) => (
                <MenuItem data-testid="map" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="email-dropdown"
              select
              label="Email"
              htmlFor="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChanges}
            >
              {filters?.emails?.map((option) => (
                <MenuItem data-testid="email" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="phone-dropdown"
              select
              label="Phone"
              htmlFor="phone"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChanges}
            >
              {filters?.phones?.map((option) => (
                <MenuItem data-testid="phone" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.root}>
            <TextField
              data-testid="website-dropdown"
              select
              label="Website"
              htmlFor="website"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChanges}
            >
              {filters?.websites?.map((option) => (
                <MenuItem data-testid="website" key={option} value={option}>
                  {option || 'Not set'}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button color="primary" onClick={applyFilters}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StakeholderFilter;
