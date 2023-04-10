import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FilterModel, { ANY_CAPTURES_AMOUNT } from '../models/FilterGrower';
import SelectOrg from './common/SelectOrg';
import { ALL_ORGANIZATIONS } from '../models/Filter';
import SelectWallet from './common/SelectWallet';
import SelectCapturesAmount from './common/SelectCapturesAmount';

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
    autocompleteInputRoot: {
      padding: `${theme.spacing(0, 12, 0, 1)} !important`,
    },
  };
};

function FilterTopGrower(props) {
  const { classes, filter } = props;
  const filterOptionAll = 'All';
  const [id, setId] = useState(filter?.id || '');
  const [personId, setPersonId] = useState(filter?.personId || '');
  const [firstName, setFirstName] = useState(filter?.firstName || '');
  const [lastName, setLastName] = useState(filter?.lastName || '');
  const [organizationId, setOrganizationId] = useState(ALL_ORGANIZATIONS);
  const [email, setEmail] = useState(filter?.email || '');
  const [phone, setPhone] = useState(filter?.phone || '');
  const [wallet, setWallet] = useState(filter?.wallet || filterOptionAll);
  const [walletSearchString, setWalletSearchString] = useState('');
  const [capturesAmountRange, setCapturesAmountRange] = useState(
    filter?.capturesAmountRange || ANY_CAPTURES_AMOUNT
  );
  const [deviceIdentifier, setDeviceIdentifier] = useState(
    filter?.device_identifier || ''
  );

  function handleSubmit(e) {
    e.preventDefault();
    const filter = new FilterModel({
      personId,
      id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      organization_id: organizationId,
      email: email.trim(),
      phone: phone.trim(),
      device_identifier: deviceIdentifier.trim(),
      wallet: wallet && wallet !== filterOptionAll ? wallet.trim() : undefined,
      capturesAmount_range: capturesAmountRange.value,
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
    setWallet(filterOptionAll);
    setWalletSearchString('');
    setCapturesAmountRange(ANY_CAPTURES_AMOUNT);

    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSubmit(e);
  };

  return (
    <>
      {
        <form onSubmit={handleSubmit}>
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
              <SelectWallet
                classes={classes}
                wallet={wallet}
                walletSearchString={walletSearchString}
                handleChangeWallet={(value) => {
                  setWallet(value);
                }}
                handleChangeWalletSearchString={(value) => {
                  setWalletSearchString(value);
                }}
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
              <SelectCapturesAmount
                capturesAmountRange={capturesAmountRange}
                handleSelection={(capturesAmountRange) => {
                  setCapturesAmountRange(capturesAmountRange);
                }}
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
