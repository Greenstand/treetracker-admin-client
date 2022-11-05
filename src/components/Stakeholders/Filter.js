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
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterModel from '../../models/FilterStakeholder';
import { AppContext } from '../../context/AppContext';
import { StakeholdersContext } from '../../context/StakeholdersContext';
import { localeSort } from '../../common/utils';
import { ALL_ORGANIZATIONS } from 'models/Filter';

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
  const [org, setOrg] = useState('');
  const orgNames = new Set(['']);
  const firstNames = new Set(['']);
  const lastNames = new Set(['']);
  const emails = new Set(['']);
  const phones = new Set(['']);
  const websites = new Set(['']);
  const maps = new Set(['']);

  // create filter lists
  useEffect(() => {
    stakeholders?.forEach((org) => {
      org.org_name && orgNames.add(org.org_name);
      org.first_name && firstNames.add(org.first_name);
      org.last_name && lastNames.add(org.last_name);
      org.email && emails.add(org.email);
      org.phone && phones.add(org.phone);
      org.website && websites.add(org.website);
      org.map && maps.add(org.map);
    });
    // setFilters({
    //   orgNames: Array.from(orgNames).sort(),
    //   firstNames: Array.from(firstNames).sort(),
    //   lastNames: Array.from(lastNames).sort(),
    //   emails: Array.from(emails).sort(),
    //   phones: Array.from(phones).sort(),
    //   websites: Array.from(websites).sort(),
    //   maps: Array.from(maps).sort(),
    // });
    setFilters({
      orgNames: localeSort(Array.from(orgNames)),
      firstNames: localeSort(Array.from(firstNames)),
      lastNames: localeSort(Array.from(lastNames)),
      emails: localeSort(Array.from(emails)),
      phones: localeSort(Array.from(phones)),
      websites: localeSort(Array.from(websites)),
      maps: localeSort(Array.from(maps)),
    });
  }, [stakeholders?.length]);

  const close = () => {
    setFormData(filter);
    setOpen(false);
  };

  const handleChanges = (e) => {
    const key = e.target.name;
    const value = e.target.value !== 'All' ? e.target.value : '';
    setFormData({ ...formData, [key]: value });
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && applyFilters(e);
  };

  const resetFilters = () => {
    setFormData(initialFilterState);
    setOrg('');
    const resetFilter = new FilterModel(initialFilterState);
    updateFilter(resetFilter);
  };

  const applyFilters = () => {
    const newFilter = new FilterModel({
      ...filter,
      ...formData,
      org_name: formData.org_name.trim(),
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
      name: 'All',
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
      {Object.values(filter).some((e) => Boolean(e)) && (
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
              label="Organization ID"
              variant="outlined"
              name="id"
              onChange={(e) => (
                handleChanges(e),
                orgList.find(
                  (o) => o.stakeholder_uuid === e.target.value && setOrg(o.name)
                )
              )}
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
            <Autocomplete
              data-testid="org-dropdown"
              label="Organization"
              htmlFor="organization"
              id="organizationId"
              name="organization_id"
              options={[...defaultOrgList, ...orgList].filter((t) => ({
                orgName: t,
              }))}
              getOptionLabel={(option) => option.name || org || 'All'}
              onChange={(_oldVal, newVal) => (
                setFormData({
                  ...formData,
                  id:
                    !newVal || !newVal.stakeholder_uuid
                      ? ''
                      : newVal.stakeholder_uuid,
                }),
                setOrg(newVal ? newVal.name : '')
              )}
              getOptionSelected={(option) => option.name === org}
              value={org ? org : null}
              renderInput={(params) => {
                return <TextField {...params} label="Organization" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="firstName-dropdown"
              label="First Name"
              htmlFor="first_name"
              id="first_name"
              name="first_name"
              value={formData.first_name ? formData.first_name : null}
              options={filters?.firstNames?.filter((t) => ({
                firstName: t,
              }))}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, first_name: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="First Name" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="lastName-dropdown"
              label="Last Name"
              htmlFor="last_name"
              id="last_name"
              name="last_name"
              value={formData.last_name ? formData.last_name : null}
              options={filters?.lastNames?.filter((t) => ({
                lastName: t,
              }))}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, last_name: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="Last Name" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="map-dropdown"
              label="Map"
              htmlFor="map"
              id="map"
              name="map"
              value={formData.map ? formData.map : null}
              options={filters?.maps?.filter((t) => ({
                map: t,
              }))}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, map: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="Map" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="email-dropdown"
              label="Email"
              htmlFor="email"
              id="email"
              name="email"
              options={filters?.emails?.filter((t) => ({
                email: t,
              }))}
              value={formData.email ? formData.email : null}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, email: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="Email" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="phone-dropdown"
              label="Phone"
              htmlFor="phone"
              id="phone"
              name="phone"
              value={formData.phone ? formData.phone : null}
              options={filters?.phones?.filter((t) => ({
                phone: t,
              }))}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, phone: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="Phone" />;
              }}
            />
          </FormControl>
          <FormControl className={classes.root}>
            <Autocomplete
              data-testid="website-dropdown"
              label="Website"
              htmlFor="website"
              id="website"
              name="website"
              value={formData.website ? formData.website : null}
              options={filters?.websites?.filter((t) => ({
                website: t,
              }))}
              getOptionLabel={(option) => option || 'All'}
              onChange={(_oldVal, newVal) =>
                setFormData({ ...formData, website: newVal })
              }
              renderInput={(params) => {
                return <TextField {...params} label="Website" />;
              }}
            />
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
