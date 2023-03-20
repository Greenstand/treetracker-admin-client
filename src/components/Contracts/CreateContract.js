import React, { useContext, useState } from 'react';
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
import { AppContext } from '../../context/AppContext';
import DateFnsUtils from '@date-io/date-fns';
import contractsAPI from '../../api/contracts';
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
  id: '',
  type: '',
  organization: '',
  contractor: '',
  totalTrees: '',
  status: '',
  lastModified: '',
};

// "id": "",
// "agreement_id": "",
// "worker_id": "",
// "status": "active",
// "notes": "",
// "type": "CBO",
// "organization": "Freetown",
// "contractor": "gwynn",
// "totalTrees": "",
// "updated_at": ""

export default function CreateContract() {
  const classes = useStyles();
  const { orgList } = useContext(AppContext);
  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setFormData(initialState);
    setErrors({});
    setOpen(false);
  };

  const validateData = () => {
    let errors = {};
    if (!formData.type) {
      errors = { ...errors, type: 'Please select a type' };
    } else if (formData.type === 'Organization' && !formData.org_name) {
      errors = { ...errors, org_name: 'Please enter an organization name' };
    } else if (formData.type === 'Person') {
      if (!formData.first_name)
        errors = { ...errors, first_name: 'Please enter a first name' };
      if (!formData.last_name)
        errors = { ...errors, last_name: 'Please enter a last name' };
    }

    if (!formData.email || /^[\w\d]@[\w\d]/.test(formData.email)) {
      errors = { ...errors, email: 'Please enter an email' };
    }
    if (!formData.phone) {
      errors = { ...errors, phone: 'Please enter a phone number' };
    }

    setErrors(errors);
    return errors;
  };

  const handleSubmit = () => {
    log.debug('submitted', formData);
    // valildate formData then post request
    const errors = validateData(formData);

    if (Object.keys(errors).length === 0) {
      contractsAPI
        .createContract(formData)
        .then((data) => console.log(data))
        .catch((e) => console.error(e));
    }
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSubmit(e);
  };

  // const defaultTypeList = [
  //   {
  //     name: 'Organization',
  //     value: 'Organization',
  //   },
  //   {
  //     name: 'Person',
  //     value: 'Person',
  //   },
  // ];

  // const defaultOrgList = [
  //   {
  //     id: ORGANIZATION_NOT_SET,
  //     name: 'Not Set',
  //     value: '',
  //   },
  // ];

  return (
    <>
      <Button onClick={openModal} color="primary">
        Add Contract
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Add Contract</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="space-between">
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Type" />
              <TextField
                placeholder="Type"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.type}
                helperText={errors.type}
                className={classes.textField}
                data-testid="type-dropdown"
                label="type"
                htmlFor="type"
                id="type"
                name="type"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Status" />
              <TextField
                placeholder="Status"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.status}
                helperText={errors.status}
                className={classes.textField}
                data-testid="status"
                label="status"
                htmlFor="status"
                id="status"
                name="status"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Agreement" />
              <TextField
                placeholder="Agreement"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.agreement}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.agreement}
                helperText={errors.agreement}
                className={classes.textField}
                data-testid="agreement"
                label="agreement"
                htmlFor="agreement"
                id="agreement"
                name="agreement"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Organization" />
              <TextField
                placeholder="Organization"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.organization}
                helperText={errors.organization}
                className={classes.textField}
                data-testid="organization"
                label="organization"
                htmlFor="organization"
                id="organization"
                name="organization"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Areas" />
              <TextField
                placeholder="Areas"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.areas}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.areas}
                helperText={errors.areas}
                className={classes.textField}
                data-testid="areas"
                label="areas"
                htmlFor="areas"
                id="areas"
                name="areas"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Contractor" />
              <TextField
                placeholder="Contractor"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.contractor}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.contractor}
                helperText={errors.contractor}
                className={classes.textField}
                data-testid="contractor"
                label="contractor"
                htmlFor="contractor"
                id="contractor"
                name="contractor"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Phone Number" />
              <TextField
                placeholder="Phone Number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.phone}
                helperText={errors.phone}
                className={classes.textField}
                data-testid="phone"
                label="phone"
                htmlFor="phone"
                id="phone"
                name="phone"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Notes" />
              <TextField
                placeholder="Notes"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.notes}
                helperText={errors.notes}
                className={classes.textField}
                data-testid="notes"
                label="notes"
                htmlFor="notes"
                id="notes"
                name="notes"
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
