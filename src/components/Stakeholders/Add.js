import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
} from '@material-ui/core';
import { ORGANIZATION_NOT_SET } from '../../models/FilterStakeholder';
import { AppContext } from '../../context/AppContext';
import { StakeholdersContext } from 'context/StakeholdersContext';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('./Add.js');

const useStyles = makeStyles({
  root: {
    width: '48%',
    margin: '5px',
    '& .MuiFormControl-fullWidth': {
      width: '100%',
      margin: '5px',
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: '4px',
    },
  },
  radioGroup: {
    flexDirection: 'row',
  },
});

const initialState = {
  type: 'Organization',
  org_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  offering_pay_to_plant: false,
  website: '',
  logo_url: '',
  map: '',
  relation: 'children',
  relation_id: '',
};

function AddStakeholder() {
  const classes = useStyles();
  const { orgList } = useContext(AppContext);
  const { createStakeholder, setStakeholders } = useContext(
    StakeholdersContext
  );
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const defaultTypeList = [
    {
      name: 'Organization',
      value: 'Organization',
    },
    {
      name: 'Person',
      value: 'Person',
    },
  ];

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setData(initialState);
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setErrors({});
    const value =
      e.target.name === 'offering_pay_to_plant'
        ? !data.offering_pay_to_plant
        : e.target.value;
    setData({ ...data, [e.target.name]: value });
  };

  const validateData = () => {
    let errors = {};
    if (!data.type) {
      errors = { ...errors, type: 'Please select a type' };
    } else if (data.type === 'Organization' && !data.org_name) {
      errors = { ...errors, org_name: 'Please enter an organization name' };
    } else if (data.type === 'Person') {
      if (!data.first_name)
        errors = { ...errors, first_name: 'Please enter a first name' };
      if (!data.last_name)
        errors = { ...errors, last_name: 'Please enter a last name' };
    }

    if (!data.email || /^[\w\d]@[\w\d]/.test(data.email)) {
      errors = { ...errors, email: 'Please enter an email' };
    }
    if (!data.phone) {
      errors = { ...errors, phone: 'Please enter a phone number' };
    }

    setErrors(errors);
    return errors;
  };

  const handleSubmit = () => {
    log.debug('submitted', data);
    // valildate data then post request
    const errors = validateData(data);

    if (Object.keys(errors).length === 0) {
      createStakeholder(data)
        .then((data) => {
          setStakeholders(data.stakeholders);
          closeModal();
        })
        .catch((e) => console.error(e));
    }
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSubmit(e);
  };

  const defaultOrgList = [
    {
      id: ORGANIZATION_NOT_SET,
      name: 'Not Set',
      value: '',
    },
  ];

  return (
    <>
      <Button onClick={openModal} color="primary">
        Add Stakeholder
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Add Stakeholder</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="space-between">
            <FormControl
              xs={12}
              sm={6}
              fullWidth={true}
              style={{ margin: '5px' }}
            >
              <TextField
                error={!!errors?.type}
                helperText={errors.type}
                className={classes.textField}
                data-testid="type-dropdown"
                select
                label="type"
                htmlFor="type"
                id="type"
                name="type"
                placeholder="Stakeholder Type"
                value={data.type}
                onChange={(e) => handleChange(e)}
                onKeyDown={handleEnterPress}
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
            {data.type === 'Person' ? (
              <>
                <FormControl xs={12} sm={6} className={classes.root}>
                  <TextField
                    error={!!errors?.first_name}
                    helperText={errors.first_name}
                    className={classes.textField}
                    label="First Name"
                    variant="outlined"
                    name="first_name"
                    onChange={handleChange}
                    value={data.first_name}
                    onKeyDown={handleEnterPress}
                  />
                </FormControl>
                <FormControl xs={12} sm={6} className={classes.root}>
                  <TextField
                    error={!!errors?.last_name}
                    helperText={errors.last_name}
                    className={classes.textField}
                    label="Last Name"
                    variant="outlined"
                    name="last_name"
                    onChange={handleChange}
                    value={data.last_name}
                    onKeyDown={handleEnterPress}
                  />
                </FormControl>
              </>
            ) : (
              <FormControl xs={12} sm={6} className={classes.root}>
                <TextField
                  error={!!errors?.org_name}
                  helperText={errors.org_name}
                  className={classes.textField}
                  label="Organization Name"
                  variant="outlined"
                  name="org_name"
                  onChange={handleChange}
                  value={data.org_name}
                  onKeyDown={handleEnterPress}
                />
              </FormControl>
            )}
            <FormControl xs={12} sm={6} className={classes.root}>
              <TextField
                error={!!errors?.email}
                helperText={errors.email}
                className={classes.textField}
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                onChange={handleChange}
                value={data.email}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <TextField
                error={!!errors?.phone}
                helperText={errors.phone}
                className={classes.textField}
                label="Phone"
                variant="outlined"
                name="phone"
                type="tel"
                onChange={handleChange}
                value={data.phone}
                onKeyDown={handleEnterPress}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <TextField
                className={classes.textField}
                label="Website"
                variant="outlined"
                name="website"
                type="url"
                onChange={handleChange}
                value={data.website}
                onKeyDown={handleEnterPress}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <TextField
                className={classes.textField}
                label="Logo URL"
                variant="outlined"
                name="logo_url"
                type="url"
                onChange={handleChange}
                value={data.logo_url}
                onKeyDown={handleEnterPress}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <TextField
                className={classes.textField}
                label="Map"
                variant="outlined"
                name="map"
                placeholder="map_address"
                onChange={handleChange}
                value={data.map}
                onKeyDown={handleEnterPress}
              />
            </FormControl>
          </Grid>
          <Grid container justifyContent="space-between">
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <TextField
                data-testid="relation-dropdown"
                select
                label="Select Parent Stakeholder:"
                htmlFor="organization"
                id="relationId"
                name="relation_id"
                value={data.relation_id}
                onChange={handleChange}
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

            <FormControl
              xs={12}
              sm={6}
              className={classes.root}
              onKeyDown={handleEnterPress}
            >
              <FormLabel id="offering_pay_to_plant">Pay-to-Plant</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    name="offering_pay_to_plant"
                    onChange={handleChange}
                    value={data.offering_pay_to_plant}
                  />
                }
                label="Offers Pay-to-Plant"
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddStakeholder;
