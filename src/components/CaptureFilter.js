import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SelectOrg from './common/SelectOrg';
import FilterModel, {
  ALL_SPECIES,
  SPECIES_ANY_SET,
  SPECIES_NOT_SET,
  ALL_ORGANIZATIONS,
  ALL_TAGS,
  TAG_NOT_SET,
  ANY_TAG_SET,
} from '../models/Filter';
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
import {
  tokenizationStates,
  datePickerDefaultMinDate,
} from '../common/variables';
import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';
import { CircularProgress } from '@material-ui/core';
import SelectWallet from './common/SelectWallet';

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
    noSpecies: {
      fontStyle: 'italic',
    },
  };
};

function Filter(props) {
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const { classes, filter } = props;
  const filterOptionAll = 'All';
  const startDateDefault = null;
  const endDateDefault = null;
  const [uuid, setUUID] = useState(filter?.uuid || '');
  const [captureId, setCaptureId] = useState(filter?.captureId || '');
  const [wallet, setWallet] = useState(filter?.wallet || filterOptionAll);
  const [walletSearchString, setWalletSearchString] = useState('');
  const [growerId, setGrowerId] = useState(filter?.grower_account_id || '');
  const [deviceId, setDeviceId] = useState(filter?.device_identifier || '');
  const [startDate, setStartDate] = useState(
    filter?.startDate || startDateDefault
  );
  const [endDate, setEndDate] = useState(filter?.endDate || endDateDefault);
  const [speciesId, setSpeciesId] = useState(filter?.speciesId || ALL_SPECIES);
  const [tag, setTag] = useState(null);
  const [tagSearchString, setTagSearchString] = useState('');
  const [organizationId, setOrganizationId] = useState(ALL_ORGANIZATIONS);
  const [tokenId, setTokenId] = useState(filter?.tokenId || filterOptionAll);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const formatDate = (date) => {
    return convertDateToDefaultSqlDate(date);
  };

  function handleSubmit(e) {
    e.preventDefault();

    // save the filer to context for editing & submit
    const test = {
      uuid: uuid.trim(),
      captureId: captureId.trim(),
      grower_account_id: growerId.trim(),
      device_identifier: deviceId.trim(),
      wallet: wallet && wallet !== filterOptionAll ? wallet.trim() : undefined,
      startDate: startDate ? formatDate(startDate) : undefined,
      endDate: endDate ? formatDate(endDate) : undefined,
      species_id: speciesId,
      tag_id: tag ? tag.id : undefined,
      organization_id: organizationId,
      tokenId: tokenId.trim(),
    };
    const filter = new FilterModel(test);

    props.onSubmit && props.onSubmit(filter);
  }

  function handleReset() {
    // reset form values, except 'approved' and 'active' which we'll keep
    setUUID('');
    setCaptureId('');
    setGrowerId('');
    setDeviceId('');
    setWallet(filterOptionAll);
    setWalletSearchString('');
    setStartDate(startDateDefault);
    setEndDate(endDateDefault);
    setSpeciesId(ALL_SPECIES);
    setTag(null);
    setTagSearchString('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setTokenId(filterOptionAll);
    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
  }

  return (
    <>
      {
        <form onSubmit={handleSubmit}>
          <Grid container wrap="nowrap" direction="row">
            <Grid item className={classes.inputContainer}>
              <TextField
                select
                htmlFor="token-status"
                id="token-status"
                label="Token Status"
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
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
                locale={getDatePickerLocale()}
              >
                <KeyboardDatePicker
                  margin="normal"
                  id="start-date-picker"
                  htmlFor="start-date-picker"
                  label="Start Date"
                  format={getDateFormatLocale()}
                  value={startDate}
                  onChange={handleStartDateChange}
                  maxDate={endDate || Date()} // Don't allow selection after today
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardDatePicker
                  margin="normal"
                  id="end-date-picker"
                  htmlFor="end-date-picker"
                  label="End Date"
                  format={getDateFormatLocale()}
                  value={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate || datePickerDefaultMinDate}
                  maxDate={Date()} // Don't allow selection after today
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
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
                htmlFor="grower-id"
                id="grower-id"
                label="Grower Account ID"
                placeholder="e.g. 2, 7"
                value={growerId}
                onChange={(e) => setGrowerId(e.target.value)}
              />
              <TextField
                htmlFor="capture-id"
                id="capture-id"
                label="Capture Reference ID"
                placeholder="e.g. 80"
                value={captureId}
                onChange={(e) => setCaptureId(e.target.value)}
              />
              <TextField
                htmlFor="uuid"
                id="uuid"
                label="Capture ID (uuid)"
                placeholder=""
                value={uuid}
                onChange={(e) => setUUID(e.target.value)}
              />
              <TextField
                htmlFor="device-identifier"
                id="device-identifier"
                label="Device Identifier"
                placeholder="e.g. 1234abcd"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
              <TextField
                data-testid="species-dropdown"
                select
                htmlFor="species"
                id="species"
                label="Species"
                value={speciesId}
                onChange={(e) => setSpeciesId(e.target.value)}
              >
                {speciesContext.isLoading ? (
                  <CircularProgress />
                ) : (
                  [
                    { id: ALL_SPECIES, name: filterOptionAll },
                    { id: SPECIES_ANY_SET, name: 'Any set' },
                    {
                      id: SPECIES_NOT_SET,
                      name: 'Not set',
                    },
                    ...speciesContext.speciesList,
                  ].map((species) => (
                    <MenuItem
                      data-testid="species-item"
                      key={species.id}
                      value={species.id}
                    >
                      {species.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <Autocomplete
                data-testid="tag-dropdown"
                label="Tag"
                htmlFor="tag"
                id="tag"
                classes={{
                  inputRoot: classes.autocompleteInputRoot,
                }}
                options={[
                  {
                    id: ALL_TAGS,
                    name: filterOptionAll,
                    isPublic: true,
                    status: 'active',
                    owner_id: null,
                  },
                  {
                    id: TAG_NOT_SET,
                    name: 'Not set',
                    isPublic: true,
                    status: 'active',
                    owner_id: null,
                  },
                  {
                    id: ANY_TAG_SET,
                    name: 'Any tag set',
                    isPublic: true,
                    status: 'active',
                    owner_id: null,
                  },
                  ...tagsContext.tagList.filter((t) =>
                    t.name
                      .toLowerCase()
                      .startsWith(tagSearchString.toLowerCase())
                  ),
                ]}
                value={tag}
                defaultValue={filterOptionAll}
                getOptionLabel={(tag) => tag.name}
                onChange={(_oldVal, newVal) => {
                  //triggered by onInputChange
                  setTag(newVal);
                }}
                onInputChange={(_oldVal, newVal) => {
                  setTagSearchString(newVal);
                }}
                renderInput={(params) => {
                  return <TextField {...params} label="Tag" />;
                }}
                getOptionSelected={(option, value) => option.id === value.id}
              />
              <SelectOrg
                orgId={organizationId}
                handleSelection={(org) => {
                  setOrganizationId(org.stakeholder_uuid);
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
                onClick={(e) => handleSubmit(e)}
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

export default withStyles(styles)(Filter);
