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
  FormGroup,
  TextField,
} from '@material-ui/core';
import GSInputLabel from '../common/InputLabel';
import { StakeholdersContext } from 'context/StakeholdersContext';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      margin: '0 5px',
    },
    width: '50%',
  },
});

const initialState = {
  type: 'Not set',
  org_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  salt: '',
  offering_pay_to_plant: false,
  website: '',
  logo_url: '',
  map: '',
};

function AddStakeholder() {
  const classes = useStyles();
  const { createStakeholder } = useContext(StakeholdersContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialState);

  const defaultTypeList = [
    {
      name: 'Not set',
      value: 'Not set', // undefined works
    },
    {
      name: 'Organization',
      value: 'Organization',
    },
    {
      name: 'Grower',
      value: 'Person',
    },
  ];

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setData(initialState);
    setOpen(false);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = () => {
    console.log('submitted', data);
    // valildate data then post request
    createStakeholder(data)
      .then(() => closeModal())
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Button onClick={openModal} color="primary">
        Add Stakeholder
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Add Stakeholder</DialogTitle>
        <DialogContent>
          <Grid container justify-content="space-between">
            <FormControl xs={12} sm={6} fullWidth={true}>
              <GSInputLabel text="Type" />
              <TextField
                required
                data-testid="type-dropdown"
                select
                label="type"
                htmlFor="type"
                id="type"
                name="type"
                placeholder="Stakeholder Type"
                value={data.type}
                onChange={(e) => handleChange(e)}
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
                  <GSInputLabel text="Grower First Name" />
                  <TextField
                    label="First Name"
                    variant="outlined"
                    name="first_name"
                    onChange={handleChange}
                    value={data.first_name}
                  />
                </FormControl>
                <FormControl xs={12} sm={6} className={classes.root}>
                  <GSInputLabel text="Grower Last Name" />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    name="last_name"
                    onChange={handleChange}
                    value={data.last_name}
                  />
                </FormControl>
              </>
            ) : (
              <FormControl xs={12} sm={6} className={classes.root}>
                <GSInputLabel text="Organization Name" />
                <TextField
                  label="Organization Name"
                  variant="outlined"
                  name="org_name"
                  onChange={handleChange}
                  value={data.org_name}
                />
              </FormControl>
            )}
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Email" />
              <TextField
                required
                label="Email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                value={data.email}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Phone" />
              <TextField
                required
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={handleChange}
                value={data.phone}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Password" />
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                onChange={handleChange}
                value={data.password}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Secret Phrase (salt)" />
              <TextField
                label="Secret Phrase (salt)"
                variant="outlined"
                name="salt"
                onChange={handleChange}
                value={data.salt}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Website" />
              <TextField
                label="Website"
                variant="outlined"
                name="website"
                onChange={handleChange}
                value={data.website}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Logo Url" />
              <TextField
                label="Logo Url"
                variant="outlined"
                name="logo_url"
                onChange={handleChange}
                value={data.logo_url}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Map Address" />
              <TextField
                label="Map"
                variant="outlined"
                name="map"
                placeholder="map_address"
                onChange={handleChange}
                value={data.map}
              />
            </FormControl>
            <FormControl xs={12} sm={6} className={classes.root}>
              <GSInputLabel text="Pay-to-Plant" />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      label="Pay-to-Plant"
                      variant="outlined"
                      name="offering_pay_to_plant"
                      onChange={handleChange}
                      value={data.offering_pay_to_plant}
                    />
                  }
                  label="Offers Pay-to-Plant"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={submit}>
            Add
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddStakeholder;
