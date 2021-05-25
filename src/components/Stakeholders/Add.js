import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
} from '@material-ui/core';

export default function AddStakeholder() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setData({});
    setOpen(false);
  };

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = () => {
    console.log(data);
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
              label="ID"
              variant="outlined"
              name="id"
              onChange={handleDataChange}
              value={data?.id || ''}
            />
            <TextField
              label="Organization Name"
              variant="outlined"
              name="name"
              onChange={handleDataChange}
              value={data?.name || ''}
            />
            <TextField
              label="Map"
              variant="outlined"
              name="map"
              onChange={handleDataChange}
              value={data?.map || ''}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              onChange={handleDataChange}
              value={data?.email || ''}
            />
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              onChange={handleDataChange}
              value={data?.phone || ''}
            />
            <TextField
              label="Website"
              variant="outlined"
              name="website"
              onChange={handleDataChange}
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
