import { Button, Grid, MenuItem, TextField } from '@material-ui/core';
import FilterModel, {
  ALL_ORGANIZATIONS,
  ALL_SPECIES,
  ANY_TAG_SET,
  TAG_NOT_SET,
} from '../models/Filter';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { useContext, useEffect, useState } from 'react';
import {
  convertDateToDefaultSqlDate,
  getDateFormatLocale,
  getDatePickerLocale,
} from '../common/locale';
import {
  verificationStates,
  captureStatus,
  datePickerDefaultMinDate,
  verificationStates,
} from '../common/variables';

// import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';
import { getVerificationStatus } from '../common/utils';
import { withStyles } from '@material-ui/core/styles';

// import { CircularProgress } from '@material-ui/core';

export const FILTER_WIDTH = 330;

const stringToDate = (string) => {
  if (!string) {
    return false;
  } else {
    return new Date(
      parseInt(string.substring(0, 4)),
      parseInt(string.substring(5, 7)) - 1,
      parseInt(string.substring(8, 10))
    );
  }
};

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
  // const speciesContext = useContext(SpeciesContext);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const tagsContext = useContext(TagsContext);
  const { classes, filter } = props;
  const filterOptionAll = 'All';
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [uuid, setUUID] = useState(
    url.searchParams.get('uuid') || filter?.uuid || ''
  );
  const [captureId, setCaptureId] = useState(
    url.searchParams.get('captureId') || filter?.captureId || ''
  );
  const [growerId, setGrowerId] = useState(
    url.searchParams.get('growerId') || filter?.planterId || ''
  );
  const [deviceId, setDeviceId] = useState(
    url.searchParams.get('deviceId') || filter?.deviceIdentifier || ''
  );
  const [growerIdentifier, setGrowerIdentifier] = useState(
    url.searchParams.get('growerIdentifier') || filter?.planterIdentifier || ''
  );
  const [approved, setApproved] = useState(filter?.approved);
  const [active, setActive] = useState(filter?.active);
  const [dateStart, setDateStart] = useState(
    stringToDate(url.searchParams.get('dateStart')) ||
      filter?.dateStart ||
      dateStartDefault
  );
  const [dateEnd, setDateEnd] = useState(
    stringToDate(url.searchParams.get('dateEnd')) ||
      filter?.dateEnd ||
      dateEndDefault
  );
  const [speciesId, setSpeciesId] = useState(filter?.speciesId || ALL_SPECIES);
  const [tag, setTag] = useState(url.searchParams.get('tag') || null);
  const [tagSearchString, setTagSearchString] = useState(
    url.searchParams.get('tagSearchString') || ''
  );
  const [organizationId, setOrganizationId] = useState(
    url.searchParams.get('organizationId') ||
      filter?.organizationId ||
      ALL_ORGANIZATIONS
  );
  let open = props.open;
  // const [tokenId, setTokenId] = useState(filter?.tokenId || filterOptionAll);

  useEffect(() => {
    handleQuerySearchParams('growerId', growerId);
    handleQuerySearchParams('captureId', captureId);
    handleQuerySearchParams('uuid', uuid);
    handleQuerySearchParams('deviceId', deviceId);
    handleQuerySearchParams(
      'dateStart',
      dateStart ? formatDate(dateStart) : ''
    );
    handleQuerySearchParams('dateEnd', dateEnd ? formatDate(dateEnd) : '');
    handleQuerySearchParams('speciesId', speciesId);
    handleQuerySearchParams('growerIdentifier', growerIdentifier);
    handleQuerySearchParams('approved', approved);
    handleQuerySearchParams('active', active);
    handleQuerySearchParams('tag', tag);
    handleQuerySearchParams('tagSearchString', tagSearchString);
    handleQuerySearchParams('organizationId', organizationId);
    handleQuerySearchParams('stakeholderUUID', stakeholderUUID);

    const filter = new FilterModel();
    filter.uuid = uuid;
    filter.captureId = captureId;
    filter.planterId = growerId;
    filter.deviceIdentifier = deviceId;
    filter.planterIdentifier = growerIdentifier;
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined;
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined;
    filter.approved = approved;
    filter.active = active;
    filter.speciesId = speciesId;
    filter.tagId = tag ? tag.id : 0;
    filter.organizationId = organizationId;
    filter.stakeholderUUID = stakeholderUUID;

    props.onSubmit && props.onSubmit(filter);
  }, []);

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

    handleQuerySearchParams('growerId', growerId);
    handleQuerySearchParams('captureId', captureId);
    handleQuerySearchParams('uuid', uuid);
    handleQuerySearchParams('deviceId', deviceId);
    handleQuerySearchParams(
      'dateStart',
      dateStart ? formatDate(dateStart) : ''
    );
    handleQuerySearchParams('dateEnd', dateEnd ? formatDate(dateEnd) : '');
    handleQuerySearchParams('speciesId', speciesId);
    handleQuerySearchParams('growerIdentifier', growerIdentifier);
    handleQuerySearchParams('approved', approved);
    handleQuerySearchParams('active', active);
    handleQuerySearchParams('tag', tag);
    handleQuerySearchParams('tagSearchString', tagSearchString);
    handleQuerySearchParams('organizationId', organizationId);
    handleQuerySearchParams('stakeholderUUID', stakeholderUUID);
    // filter.tokenId = tokenId;

    handleFilter();
  }

  function handleFilter() {
    console.log(dateStart);
    const filter = new FilterModel();
    filter.uuid = uuid;
    filter.captureId = captureId.trim();
    filter.grower_account_id = growerId.trim();
    filter.device_identifier = deviceId.trim();
    filter.wallet = wallet.trim();
    filter.startDate = startDate ? formatDate(startDate) : undefined;
    filter.endDate = endDate ? formatDate(endDate) : undefined;
    filter.status = status;
    filter.species_id = speciesId;
    filter.tag_id = tag ? tag.id : undefined;
    filter.organization_id = organizationId;
    filter.stakeholderUUID = stakeholderUUID;
    // filter.tokenId = tokenId;
    props.onSubmit && props.onSubmit(filter);
  }

  function handleReset() {
    // reset form values, except 'approved' and 'active' which we'll keep
    setUUID('');
    setCaptureId('');
    setGrowerId('');
    setDeviceId('');
    setWallet('');
    setStartDate(startDateDefault);
    setEndDate(endDateDefault);
    setSpeciesId(ALL_SPECIES);
    setTag(null);
    setTagSearchString('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setStakeholderUUID(ALL_ORGANIZATIONS);
    // setTokenId(filterOptionAll);

    const filter = new FilterModel();
    filter.status = status; //keep last value set
    props.onSubmit && props.onSubmit(filter);
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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ display: open ? 'block' : 'none' }}
      >
        <Grid container wrap="nowrap" direction="row">
          <Grid item className={classes.inputContainer}>
            <TextField
              select
              htmlFor="verification-status"
              id="verification-status"
              label="Verification Status"
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
            {/* <TextField
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
              </TextField> */}
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
                value={dateStart}
                onChange={handleDateStartChange}
                maxDate={dateEnd || Date()} // Don't allow selection after today
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
                value={dateEnd}
                onChange={handleDateEndChange}
                minDate={dateStart || datePickerDefaultMinDate}
                maxDate={Date()} // Don't allow selection after today
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              htmlFor="grower-id"
              id="grower-id"
              label="Grower Account ID"
              placeholder="e.g. 7"
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
              label="Capture UUID"
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
              htmlFor="grower-identifier"
              id="grower-identifier"
              label="Wallet/Grower Identifier"
              placeholder="e.g. grower@example.com"
              value={growerIdentifier}
              onChange={(e) => setGrowerIdentifier(e.target.value)}
            />
            {/* <TextField
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
                  { id: ALL_SPECIES, name: 'All' },
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
            </TextField> */}
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
                  name: 'All',
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
              defaultValue={'All'}
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
                setOrganizationId(org.id);
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
    </>
  );
}

export default withStyles(styles)(Filter);
