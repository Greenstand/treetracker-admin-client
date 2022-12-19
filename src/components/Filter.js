import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import IconClose from '@material-ui/icons/CloseRounded';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FilterModel from '../models/Filter';
import GSInputLabel from './common/InputLabel';
import classNames from 'classnames';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  getDatePickerLocale,
  getDateFormatLocale,
  convertDateToDefaultSqlDate,
} from '../common/locale';
import { datePickerDefaultMinDate } from '../common/variables';
import { getVerificationStatus } from '../common/utils';
import { verificationStates, tokenizationStates } from '../common/variables';

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
    button: {
      marginTop: 5,
    },
  };
};

function Filter(props) {
  const { classes, filter } = props;
  // console.log('filter', filter);
  const filterOptionAll = 'All';
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [captureId, setCaptureId] = useState(filter?.captureId || '');
  const [wallet, setWallet] = useState(filter?.wallet || '');
  const [growerId, setGrowerId] = useState(filter?.planterId || '');
  const [deviceIdentifier, setDeviceIdentifier] = useState(
    filter?.deviceIdentifier || ''
  );
  const [growerIdentifier, setGrowerIdentifier] = useState(
    filter?.planterIdentifier || ''
  );
  const [status, setStatus] = useState(filter?.status);
  const [approved, setApproved] = useState(filter?.approved);
  const [active, setActive] = useState(filter?.active);
  const [dateStart, setDateStart] = useState(
    filter?.dateStart || dateStartDefault
  );
  const [dateEnd, setDateEnd] = useState(filter?.dateEnd || dateEndDefault);
  const [tokenId, setTokenId] = useState(filter?.tokenId || filterOptionAll);

  const handleDateStartChange = (date) => {
    setDateStart(date);
  };

  const handleDateEndChange = (date) => {
    setDateEnd(date);
  };

  const formatDate = (date) => {
    return convertDateToDefaultSqlDate(date);
  };

  function handleCloseClick() {
    props.onClose && props.onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const filter = new FilterModel();
    filter.captureId = captureId;
    filter.wallet = wallet
    filter.planterId = growerId;
    filter.deviceIdentifier = deviceIdentifier;
    filter.planterIdentifier = growerIdentifier;
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined;
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined;
    filter.approved = approved;
    filter.active = active;
    filter.tokenId = tokenId;
    filter.status = status;
    props.onSubmit && props.onSubmit(filter);
  }

  function handleClear() {
    setCaptureId('');
    setWallet('');
    setGrowerId('');
    setDeviceIdentifier('');
    setGrowerIdentifier('');
    setDateStart(dateStartDefault);
    setDateEnd(dateEndDefault);
    setApproved();
    setActive();
    setTokenId(filterOptionAll);
    setStatus('All');

    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
  }

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={props.isOpen}
      variant="persistent"
      anchor="right"
      PaperProps={{
        elevation: props.isOpen ? 6 : 0,
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Filters</Typography>
        </Grid>
        {props.onClose && (
          <Grid item>
            <IconButton
              color="primary"
              classes={{
                colorPrimary: classes.close,
              }}
              onClick={handleCloseClick}
            >
              <IconClose />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <Button variant="outlined" color="primary" onClick={handleSubmit}>
        Apply Filters
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClear}
        className={classNames(classes.button)}
      >
        Clear Filters
      </Button>
      <GSInputLabel text="Capture ID" />
      <TextField
        placeholder="e.g. 80"
        InputLabelProps={{
          shrink: true,
        }}
        value={captureId}
        onChange={(e) => setCaptureId(e.target.value)}
      />
      <GSInputLabel text="Wallet" />
      <TextField
        placeholder="wallet"
        InputLabelProps={{
          shrink: true,
        }}
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
      <GSInputLabel text="Grower ID" />
      <TextField
        placeholder="grower id"
        InputLabelProps={{
          shrink: true,
        }}
        value={growerId}
        onChange={(e) => setGrowerId(e.target.value)}
      />
      <GSInputLabel text="Device Identifier" />
      <TextField
        placeholder="device identifier"
        InputLabelProps={{
          shrink: true,
        }}
        value={deviceIdentifier}
        onChange={(e) => setDeviceIdentifier(e.target.value)}
      />
      <GSInputLabel text="Grower Identifier" />
      <TextField
        placeholder="grower identifier"
        InputLabelProps={{
          shrink: true,
        }}
        value={growerIdentifier}
        onChange={(e) => setGrowerIdentifier(e.target.value)}
      />
      <GSInputLabel text="Verification Status" />
      <TextField
        select
        value={
          active === undefined && approved === undefined
            ? filterOptionAll
            : getVerificationStatus(active, approved)
        }
        onChange={(e) => {
          setApproved(
            e.target.value === filterOptionAll
              ? undefined
              : e.target.value === verificationStates.AWAITING ||
                e.target.value === verificationStates.REJECTED
              ? false
              : true
          );
          setActive(
            e.target.value === filterOptionAll
              ? undefined
              : e.target.value === verificationStates.AWAITING ||
                e.target.value === verificationStates.APPROVED
              ? true
              : false
          );
        }}
      >
        {[
          filterOptionAll,
          verificationStates.APPROVED,
          verificationStates.AWAITING,
          verificationStates.REJECTED,
        ].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <GSInputLabel text="Token Status" />
      <TextField
        select
        value={tokenId}
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      >
        {[
          filterOptionAll,
          tokenizationStates.NOT_TOKENIZED,
          tokenizationStates.TOKENIZED,
        ].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <GSInputLabel text="Time created" />
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={getDatePickerLocale()}
      >
        <Grid container justifyContent="space-between">
          <KeyboardDatePicker
            margin="normal"
            id="start-date-picker"
            label="Start Date"
            value={dateStart}
            onChange={handleDateStartChange}
            format={getDateFormatLocale()}
            maxDate={dateEnd || Date()} // Don't allow selection after today
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateInput}
          />
          <KeyboardDatePicker
            margin="normal"
            id="end-date-picker"
            label="End Date"
            value={dateEnd}
            onChange={handleDateEndChange}
            format={getDateFormatLocale()}
            minDate={dateStart || datePickerDefaultMinDate}
            maxDate={Date()} // Don't allow selection after today
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.dateInput}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Drawer>
  );
}

export default withStyles(styles)(Filter);
