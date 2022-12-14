import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import FilterModel, { ALL_ORGANIZATIONS, FILTER_FIELDS } from '../models/FilterGrower';
import Grid from '@material-ui/core/Grid';
import SelectOrg from './common/SelectOrg';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

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
  const { classes, filter } = props;
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const [id, setId] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.id));
  const [personId, setPersonId] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.personId));
  const [firstName, setFirstName] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.firstName));
  const [lastName, setLastName] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.lastName));
  const [email, setEmail] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.email));
  const [phone, setPhone] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.phone));
  const [wallet, setWallet] = useState(getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.wallet));
  const [deviceIdentifier, setDeviceIdentifier] = useState(
    getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.deviceIdentifier
  ));
  const [organizationId, setOrganizationId] = useState(
    getValueFromUrlOrFilter(url, filter, FILTER_FIELDS.organizationId, ALL_ORGANIZATIONS)
  );
      
  const getValueFromUrlOrFilter = (url, filter, attr, defaultVal = '') => {
    return (url?.searchParams.get(attr) || filter?.[attr] || defaultVal);
  }

  const handleQuerySearchParams = (name, value) => {
    if (params.has(name) && value == '') {
      url.searchParams.delete(name);
      window.history.pushState({}, '', url.search);
    } else if (!params.has(name) && value == '') {
      return;
    } else if (!params.get(name)) {
      url.searchParams.append(name, value);
      window.history.pushState({}, '', url.search);
    } else if (params.get(name)) {
      url.searchParams.set(name, value);
      window.history.pushState({}, '', url.search);
    }
  };

  handleAllQuerySearchParams() {
    handleQuerySearchParams(FILTER_FIELDS.id, id);
    handleQuerySearchParams(FILTER_FIELDS.personId, personId);
    handleQuerySearchParams(FILTER_FIELDS.firstName, firstName);
    handleQuerySearchParams(FILTER_FIELDS.lastName, lastName);
    handleQuerySearchParams(FILTER_FIELDS.organizationId, organizationId);
    handleQuerySearchParams(FILTER_FIELDS.email, email);
    handleQuerySearchParams(FILTER_FIELDS.phone, phone);
    handleQuerySearchParams(FILTER_FIELDS.deviceIdentifier, deviceIdentifier);
    handleQuerySearchParams(FILTER_FIELDS.wallet, wallet);
  }

  useEffect(() => {
    handleAllQuerySearchParams();

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
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    handleAllQuerySearchParams();

    const filter = new FilterModel({
      personId,
      id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      organization_id: organizationId,
      email: email.trim(),
      phone: phone.trim(),
      device_identifier: deviceIdentifier.trim(),
      wallet: wallet.trim(),
    });
    props.onSubmit && props.onSubmit(filter);
  }

  const handleReset = () => {
    setId('');
    setPersonId('');
    setFirstName('');
    setLastName('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setEmail('');
    setPhone('');
    setDeviceIdentifier('');
    setWallet('');

    handleAllQuerySearchParams();

    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSubmit(e);
  };

  return (
    <>
      {
        <form onSubmit={handleSubmit} style={{}}>
          <Grid container wrap="nowrap" direction="row">
            <Grid item className={classes.inputContainer}>
              <TextField
                className={`${classes.textField} ${classes.filterElement}`}
                label="Grower Account ID"
                htmlFor="Grower Account ID"
                id="Grower Account ID"
                placeholder="Grower Account ID"
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
              <SelectOrg
                orgId={organizationId}
                handleSelection={(org) => {
                  setOrganizationId(org.stakeholder_uuid);
                }}
              />
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
                label="Wallet"
                htmlFor="Wallet"
                id="Wallet"
                placeholder="Wallet"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
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
