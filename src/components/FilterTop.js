import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterModel, {
  ALL_SPECIES,
  SPECIES_NOT_SET,
  ALL_ORGANIZATIONS,
  ORGANIZATION_NOT_SET,
  // TAG_NOT_SET,
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
  verificationStates,
  tokenizationStates,
  datePickerDefaultMinDate,
} from '../common/variables';
import { AppContext } from '../context/AppContext';
import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';

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
  // console.log('render: filter top');
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const { classes, filter = new FilterModel() } = props;
  const filterOptionAll = 'All';
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [captureId, setCaptureId] = useState(filter?.captureId || '');
  const [planterId, setPlanterId] = useState(filter?.planterId || '');
  const [deviceId, setDeviceId] = useState(filter?.deviceIdentifier || '');
  const [planterIdentifier, setPlanterIdentifier] = useState(
    filter?.planterIdentifier || '',
  );
  const [approved, setApproved] = useState(filter?.approved);
  const [active, setActive] = useState(filter?.active);
  const [dateStart, setDateStart] = useState(
    filter?.dateStart || dateStartDefault,
  );
  const [dateEnd, setDateEnd] = useState(filter?.dateEnd || dateEndDefault);
  const [speciesId, setSpeciesId] = useState(filter?.speciesId || ALL_SPECIES);
  const [tag, setTag] = useState(null);
  const [tagSearchString, setTagSearchString] = useState('');
  const [organizationId, setOrganizationId] = useState(
    filter.organizationId || ALL_ORGANIZATIONS,
  );
  const [tokenId, setTokenId] = useState(filter?.tokenId || filterOptionAll);

  useEffect(() => {
    if (tagSearchString === '') {
      const abortController = new AbortController();
      tagsContext.getTags(tagSearchString, { signal: abortController.signal });
      return () => abortController.abort();
    }
  }, [tagSearchString]);

  const handleDateStartChange = (date) => {
    setDateStart(date);
  };

  const handleDateEndChange = (date) => {
    setDateEnd(date);
  };

  const formatDate = (date) => {
    return convertDateToDefaultSqlDate(date);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // save the filer to context for editing & submit
    const filter = new FilterModel();
    filter.captureId = captureId;
    filter.planterId = planterId;
    filter.deviceIdentifier = deviceId;
    filter.planterIdentifier = planterIdentifier;
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined;
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined;
    filter.approved = approved;
    filter.active = active;
    filter.speciesId = speciesId;
    filter.tagId = tag ? tag.id : 0;
    filter.organizationId = organizationId;
    filter.tokenId = tokenId;
    props.onSubmit && props.onSubmit(filter);
  }

  function handleReset() {
    // reset form values, except 'approved' and 'active' which we'll keep
    setCaptureId('');
    setPlanterId('');
    setDeviceId('');
    setPlanterIdentifier('');
    setDateStart(dateStartDefault);
    setDateEnd(dateEndDefault);
    setSpeciesId(ALL_SPECIES);
    setTag(null);
    setTagSearchString('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setTokenId(filterOptionAll);

    const filter = new FilterModel();
    filter.approved = approved; // keeps last value set
    filter.active = active; // keeps last value set
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
                      : true,
                  );
                  setActive(
                    e.target.value === filterOptionAll
                      ? undefined
                      : e.target.value === verificationStates.AWAITING ||
                        e.target.value === verificationStates.APPROVED
                      ? true
                      : false,
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
                  format={getDateFormatLocale(true)}
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
                  format={getDateFormatLocale(true)}
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
                htmlFor="planter-id"
                id="planter-id"
                label="Planter ID"
                placeholder="e.g. 7"
                value={planterId}
                onChange={(e) => setPlanterId(e.target.value)}
              />
              <TextField
                htmlFor="capture-id"
                id="capture-id"
                label="Capture ID"
                placeholder="e.g. 80"
                value={captureId}
                onChange={(e) => setCaptureId(e.target.value)}
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
                htmlFor="planter-identifier"
                id="planter-identifier"
                label="Planter Identifier"
                placeholder="e.g. planter@example.com"
                value={planterIdentifier}
                onChange={(e) => setPlanterIdentifier(e.target.value)}
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
                {[
                  { id: ALL_SPECIES, name: 'All' },
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
                ))}
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
                  // {
                  //   id: TAG_NOT_SET,
                  //   tagName: 'Not set',
                  //   active: true,
                  //   public: true,
                  // },
                  ...tagsContext.tagList,
                ]}
                value={tag}
                defaultValue={'Not set'}
                getOptionLabel={(tag) => {
                  // if (tag === 'Not set') {
                  //   return 'Not set';
                  // }
                  return tag.tagName;
                }}
                onChange={(_oldVal, newVal) => {
                  //triggered by onInputChange
                  console.log('newVal -- ', newVal);
                  if (newVal && newVal.tagName === 'Not set') {
                    setTag('Not set');
                  } else {
                    setTag(newVal);
                  }
                }}
                onInputChange={(_oldVal, newVal) => {
                  setTagSearchString(newVal);
                }}
                renderInput={(params) => {
                  return <TextField {...params} label="Tag" />;
                }}
                // selectOnFocus
                // clearOnBlur
                // handleHomeEndKeys
              />
              {!userHasOrg && (
                <TextField
                  data-testid="org-dropdown"
                  select
                  label="Organization"
                  htmlFor="organization"
                  id="organization"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                >
                  {[
                    {
                      id: ALL_ORGANIZATIONS,
                      name: 'All',
                    },
                    {
                      id: ORGANIZATION_NOT_SET,
                      name: 'Not set',
                    },
                    ...orgList,
                  ].map((org) => (
                    <MenuItem
                      data-testid="org-item"
                      key={org.id}
                      value={org.id}
                    >
                      {org.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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

const getVerificationStatus = (active, approved) => {
  if (active === true && approved === false) {
    return verificationStates.AWAITING;
  } else if (active === true && approved === true) {
    return verificationStates.APPROVED;
  } else if (active === false && approved === false) {
    return verificationStates.REJECTED;
  }
};

export default withStyles(styles)(Filter);
