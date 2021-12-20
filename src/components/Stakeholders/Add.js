import React, { useState, useContext } from 'react';
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
import { StakeholdersContext } from 'context/StakeholdersContext';

function AddStakeholder() {
  const { createStakeholder } = useContext(StakeholdersContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

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

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setData({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = () => {
    createStakeholder(data).then(() => {
      closeModal();
    });
  };

  return (
    <>
      <Button onClick={openModal} color="primary">
        Add Stakeholder
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Add Stakeholder</DialogTitle>
        <DialogContent>
          <FormControl>
            <TextField
              data-testid="type-dropdown"
              select
              label="type"
              htmlFor="type"
              id="type"
              name="type"
              value={data?.type || ''}
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
            <TextField
              label="Organization Name"
              variant="outlined"
              name="org_name"
              onChange={handleChange}
              value={data?.org_name || ''}
            />
            <TextField
              label="First Name"
              variant="outlined"
              name="first_name"
              onChange={handleChange}
              value={data?.first_name || ''}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="last_name"
              onChange={handleChange}
              value={data?.last_name || ''}
            />
            <TextField
              label="Map"
              variant="outlined"
              name="map"
              placeholder="map_address"
              onChange={handleChange}
              value={data?.map || ''}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              onChange={handleChange}
              value={data?.email || ''}
            />
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              onChange={handleChange}
              value={data?.phone || ''}
            />
            <TextField
              label="Image Url"
              variant="outlined"
              name="imageUrl"
              onChange={handleChange}
              value={data?.imageUrl || ''}
            />
            <TextField
              label="Logo Url"
              variant="outlined"
              name="logoUrl"
              onChange={handleChange}
              value={data?.logoUrl || ''}
            />
            <TextField
              label="Website"
              variant="outlined"
              name="website"
              onChange={handleChange}
              value={data?.website || ''}
            />
          </FormControl>
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
