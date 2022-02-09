import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FilterModel from '../models/FilterGrower';
import { ALL_ORGANIZATIONS, ORGANIZATION_NOT_SET } from '../models/Filter';
import { AppContext } from '../context/AppContext';

export const FILTER_WIDTH = 330;

const styles = (theme) => {
  return {
    root: {},
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      width: FILTER_WIDTH,
      padding: theme.spacing(3, 2, 2, 2),
      /*
       * boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
       * */
    },
    close: {
      color: theme.palette.grey[500],
    },
    dateInput: {
      width: 158,
      fontSize: 14,
    },
    inputContainer: {
      margin: theme.spacing(1),
      '&>*': {
        display: 'inline-flex',
        width: 160,
        margin: theme.spacing(1.5, 1),
      },
    },
    apply: {
      width: 90,
      height: 36,
    },
  };
};

function FilterTopGrower(props) {
  const { orgList, userHasOrg } = useContext(AppContext);
  const { classes, filter } = props;
  const [id, setId] = useState(filter?.id || '');
  const [personId, setPersonId] = useState(filter?.personId || '');
  const [firstName, setFirstName] = useState(filter?.firstName || '');
  const [lastName, setLastName] = useState(filter?.lastName || '');
  const [organizationId, setOrganizationId] = useState(
    filter?.organizationId || ALL_ORGANIZATIONS
  );
  const [stakeholderUUID, setStakeholderUUID] = useState(
    filter?.stakeholderUUID || ALL_ORGANIZATIONS
  );
  const [email, setEmail] = useState(filter?.email || '');
  const [phone, setPhone] = useState(filter?.phone || '');
  const [deviceIdentifier, setDeviceIdentifier] = useState(
    filter?.deviceIdentifier || ''
  );

  function handleSubmit(e) {
    e.preventDefault();
    const filter = new FilterModel({
      personId,
      id,
      firstName,
      lastName,
      organizationId,
      stakeholderUUID,
      email,
      phone,
      deviceIdentifier,
    });
    props.onSubmit && props.onSubmit(filter);
  }

  const handleReset = () => {
    setId('');
    setPersonId('');
    setFirstName('');
    setLastName('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setStakeholderUUID(ALL_ORGANIZATIONS);
    setEmail('');
    setPhone('');
    setDeviceIdentifier('');

    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
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
      {
        <form onSubmit={handleSubmit}>
          <Grid container wrap="nowrap" direction="row">
            <Grid item className={classes.inputContainer}>
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Grower ID"
                htmlFor="Grower ID"
                id="Grower ID"
                placeholder="Grower ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Person ID"
                htmlFor="Person ID"
                id="Person ID"
                placeholder="Person ID"
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Device ID"
                htmlFor="Device ID"
                id="Device ID"
                placeholder="Device ID"
                value={deviceIdentifier}
                onChange={(e) => setDeviceIdentifier(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              {
                /* {!userHasOrg && ( }*/
                <TextField
                  className={`${classes.textField} ${classes.filterElement}`}
                  data-testid="org-dropdown"
                  select
                  label="Organization"
                  htmlFor="Organization"
                  id="Organization"
                  placeholder="Organization"
                  value={organizationId}
                  onChange={(e) => {
                    const org = orgList.find((o) => o.id === e.target.value);
                    setStakeholderUUID(
                      org ? org.stakeholder_uuid : e.target.value
                    );
                    setOrganizationId(e.target.value);
                  }}
                  onKeyDown={handleEnterPress}
                >
                  {[...defaultOrgList, ...orgList].map((org) => (
                    <MenuItem
                      data-testid="org-item"
                      key={org.id}
                      value={org.id}
                    >
                      {org.name}
                    </MenuItem>
                  ))}
                </TextField>
                //)
              }
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="First Name"
                htmlFor="First Name"
                id="First Name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Last Name"
                htmlFor="Last Name"
                id="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Email"
                htmlFor="Email"
                id="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleEnterPress}
              />
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Phone Number"
                htmlFor="Phone Number"
                id="Phone Number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={handleEnterPress}
              />
            </Grid>
            <Grid className={classes.inputContainer}>
              <Button
                className={classes.apply}
                type="submit"
                label="submit"
                htmlFor="submit"
                id="submit"
                variant="outlined"
                color="primary"
                onClick={handleSubmit}
              >
                Apply
              </Button>

              <Button
                className={classes.apply}
                label="reset"
                htmlFor="reset"
                id="reset"
                variant="outlined"
                color="primary"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      }
    </>
  );
}

export default withStyles(styles)(FilterTopGrower);
