import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  // Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  FormControl,
  // FormControlLabel,
  FormLabel,
  // Select,
  TextField,
} from '@material-ui/core';
import { AppContext } from '../../context/AppContext';
import { ALL_ORGANIZATIONS, ORGANIZATION_NOT_SET } from 'models/Filter';
// import DateFnsUtils from '@date-io/date-fns';
import SelectOrg from '../common/SelectOrg';
import contractsAPI from '../../api/contracts';
import { AGREEMENT_TYPE } from 'common/variables';
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

/*
POST https://dev-k8s.treetracker.org/contract/contract
{
    "agreement_id": "7bf1f932-2474-4211-8a07-a764ca95c80f",
    "worker_id": "93a026d2-a511-404f-958c-a0a36892af0f",
    "notes": "test contract notes"
}
GET https://dev-k8s.treetracker.org/contract/contract
{
    "id": "5de33643-2c9a-4d1c-9643-285d7a75e820",
    "agreement_id": "7bf1f932-2474-4211-8a07-a764ca95c80f",
    "worker_id": "93a026d2-a511-404f-958c-a0a36892af0f",
    "status": "unsigned",
    "notes": "test contract notes",
    "created_at": "2023-03-05T19:57:59.555Z",
    "updated_at": "2023-03-05T19:57:59.555Z",
    "signed_at": null,
    "closed_at": null,
    "listed": true

    type
    organization
    contractor
    total trees
}


POST https://dev-k8s.treetracker.org/contract/agreement
{
    "type": "grower",
    "owner_id": "08c71152-c552-42e7-b094-f510ff44e9cb",
    "funder_id":"c558a80a-f319-4c10-95d4-4282ef745b4b",
    "consolidation_rule_id": "6ff67c3a-e588-40e3-ba86-0df623ec6435",
    "name": "test agreement",
    "species_agreement_id": "e14b78c8-8f71-4c42-bb86-5a7f71996336"
}

POST https://dev-k8s.treetracker.org/contract/consolidation_rule
{
    "name": "test",
    "owner_id": "af7c1fe6-d669-414e-b066-e9733f0de7a8",
    "lambda": "something"
}

POST https://dev-k8s.treetracker.org/contract/species_agreement
{
    "name": "test species agreement",
    "owner_id": "af7c1fe6-d669-414e-b066-e9733f0de7a8",
    "description": "test species agreement description"
}

*/

const initialState = {
  name: '',
  type: '',
  owner_id: '',
  funder_id: '',
  consolidation_rule_id: '6ff67c3a-e588-40e3-ba86-0df623ec6435',
  species_agreement_id: 'e14b78c8-8f71-4c42-bb86-5a7f71996336',
};

export default function CreateContractAgreement() {
  const classes = useStyles();
  const { orgId, userHasOrg, orgList } = useContext(AppContext);
  console.log(
    'orgId - ',
    orgId,
    'userHasOrg - ',
    userHasOrg
    // 'orgList - ',
    // orgList
  );
  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    log.debug('Cancelled: close modal');
    setFormData(initialState);
    setErrors({});
    setOpen(false);
  };

  const validateData = () => {
    let errors = {};
    if (!formData.type) {
      errors = {
        ...errors,
        type: 'Please select a Type',
      };
    }
    if (formData.name === '') {
      errors = {
        ...errors,
        org_name: 'Please enter an Agreement Name',
      };
    }
    if (!formData.owner_id) {
      errors = {
        ...errors,
        first_name: 'Please select an Organization as Owner',
      };
    }
    if (!formData.funder_id) {
      errors = {
        ...errors,
        last_name: 'Please select a Funder Organization',
      };
    }
    if (!formData.consolidation_rule_id) {
      errors = {
        ...errors,
        last_name: 'Please select a Consolidation Rule',
      };
    }
    if (!formData.species_agreement_id) {
      errors = {
        ...errors,
        last_name: 'Please select a Species Agreement',
      };
    }

    setErrors(errors);
    return errors;
  };

  const handleSubmit = () => {
    log.debug('submitted', formData);
    // valildate formData then post request
    const errors = validateData(formData);
    log.debug('ERRORS:', errors);

    if (Object.keys(errors).length === 0) {
      contractsAPI
        .createContractAgreement(formData)
        .then((data) => console.log(data))
        .catch((e) => console.error(e));
    }
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSubmit(e);
  };

  const defaultOrgList = userHasOrg
    ? [
        {
          id: ALL_ORGANIZATIONS,
          stakeholder_uuid: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
      ]
    : [
        {
          id: ALL_ORGANIZATIONS,
          stakeholder_uuid: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
        {
          id: ORGANIZATION_NOT_SET,
          stakeholder_uuid: ORGANIZATION_NOT_SET,
          name: 'Not set',
          value: null,
        },
      ];

  return (
    <>
      <Button onClick={openModal} color="primary">
        Add Contract Agreement
      </Button>
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Add Contract</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="space-between">
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Agreement Name" />
              <TextField
                placeholder="Agreement Name"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.name}
                helperText={errors.name}
                className={classes.textField}
                data-testid="name"
                label="name"
                htmlFor="name"
                id="name"
                name="name"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Type" />
              <TextField
                select
                placeholder="Select Type"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.type}
                helperText={errors.type}
                className={classes.textField}
                data-testid="type-dropdown"
                label="Type"
                htmlFor="type"
                id="type"
                name="type"
              >
                {Object.entries(AGREEMENT_TYPE).map(([key, value]) => (
                  <MenuItem data-testid="type-option" key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Owner Organization" />
              <SelectOrg
                orgId={formData.owner_id || orgId || ALL_ORGANIZATIONS}
                // defaultOrgs={defaultOrgList}
                handleSelection={(org) => {
                  console.log(
                    'handleSelection SelectOrg',
                    org.stakeholder_uuid,
                    orgId
                  );
                  setFormData({
                    ...formData,
                    owner_id: org?.stakeholder_uuid,
                  });
                }}
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Funder ID" />
              <TextField
                select
                placeholder="Funder ID"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.funder_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.funder_id}
                helperText={errors.funder_id}
                className={classes.textField}
                data-testid="funder_id"
                label="funder_id"
                htmlFor="funder_id"
                id="funder_id"
                name="funder_id"
                aria-required
              >
                {[...defaultOrgList, ...orgList].map((org) => (
                  <MenuItem
                    data-testid="org-item"
                    key={org.stakeholder_uuid}
                    value={org.stakeholder_uuid}
                  >
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Consolidation Rule ID" />
              <TextField
                placeholder="Consolidation Rule ID"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.consolidation_rule_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.consolidation_rule_id}
                helperText={errors.consolidation_rule_id}
                className={classes.textField}
                data-testid="consolidation_rule_id"
                label="consolidation_rule_id"
                htmlFor="consolidation_rule_id"
                id="consolidation_rule_id"
                name="consolidation_rule_id"
              />
            </FormControl>
            <FormControl className={classes.root} onKeyDown={handleEnterPress}>
              <FormLabel text="Species Agreement ID" />
              <TextField
                placeholder="Species Agreement ID"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.species_agreement_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={handleEnterPress}
                error={!!errors?.species_agreement_id}
                helperText={errors.species_agreement_id}
                className={classes.textField}
                data-testid="species_agreement_id"
                label="species_agreement_id"
                htmlFor="species_agreement_id"
                id="species_agreement_id"
                name="species_agreement_id"
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
