import React, { useState, useEffect } from 'react';
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
  TAG_NOT_SET,

} from '../models/Filter';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  getDatePickerLocale,
  getDateFormatLocale,
  convertDateToDefaultSqlDate,
} from '../common/locale';
import { getOrganization } from '../api/apiUtils';
import {
  verificationStates,
  tokenizationStates,
  datePickerDefaultMinDate,
} from '../common/variables';

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
  const { classes, filter } = props;
  const filterOptionAll = 'All';
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [captureId, setCaptureId] = useState(filter.captureId || '');
  const [planterId, setPlanterId] = useState(filter.planterId || '');
  const [deviceId, setDeviceId] = useState(filter.deviceIdentifier || '');
  const [planterIdentifier, setPlanterIdentifier] = useState(
    filter.planterIdentifier || '',
  );
  const [approved, setApproved] = useState(filter.approved);
  const [active, setActive] = useState(filter.active);
  const [dateStart, setDateStart] = useState(
    filter.dateStart || dateStartDefault,
  );
  const [dateEnd, setDateEnd] = useState(filter.dateEnd || dateEndDefault);
  const [speciesId, setSpeciesId] = useState(filter.speciesId || ALL_SPECIES);
  const [tag, setTag] = useState(null);
  // TODO: how to save the tag state when the filter top opens/closes
  // e.g. state --> {"id":5,"tagName":"another_tag","active":true,"public":true}
  const [tagSearchString, setTagSearchString] = useState('');
  const [organizationId, setOrganizationId] = useState(
    filter.organizationId || ALL_ORGANIZATIONS,
  );
  const [userHasOrg, setUserHasOrg] = useState(false);
  const [tokenId, setTokenId] = useState(filterOptionAll);

  useEffect(() => {
    props.tagsDispatch.getTags(tagSearchString);
  }, [tagSearchString, props.tagsDispatch]);

  useEffect(() => {
    const hasOrg = getOrganization();
    setUserHasOrg(hasOrg ? true : false);
    // if not an org account && the org list isn't loaded --> load the orgs
    if (!hasOrg && !props.organizationState.organizationList.length) {
      props.organizationDispatch.loadOrganizations();
    }
  }, []);

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
    setOrganizationId(ALL_ORGANIZATIONS);
    setTag(null);
    setTagSearchString('');
    setTokenId(filterOptionAll);

    const filter = new FilterModel();
    filter.approved = approved; // keeps last value set
    filter.active = active; // keeps last value set
    props.onSubmit && props.onSubmit(filter);
  }

  return (
    <React.Fragment>
      {
        <form onSubmit={handleSubmit}>
          <Grid container wrap="nowrap" direction="row">
            <Grid item className={classes.inputContainer}>
              <TextField
                select
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
                  label="Start Date"
                  format={getDateFormatLocale(true)}
                  value={dateStart}
                  onChange={handleDateStartChange}
                  maxDate={dateEnd || Date()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardDatePicker
                  margin="normal"
                  id="end-date-picker"
                  label="End Date"
                  format={getDateFormatLocale(true)}
                  value={dateEnd}
                  onChange={handleDateEndChange}
                  minDate={dateStart || datePickerDefaultMinDate}
                  maxDate={Date()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                label="Planter ID"
                placeholder="e.g. 7"
                value={planterId}
                onChange={(e) => setPlanterId(e.target.value)}
              />
              <TextField
                label="Capture ID"
                placeholder="e.g. 80"
                value={captureId}
                onChange={(e) => setCaptureId(e.target.value)}
              />
              <TextField
                label="Device Identifier"
                placeholder="e.g. 1234abcd"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
              <TextField
                label="Planter Identifier"
                placeholder="e.g. planter@example.com"
                value={planterIdentifier}
                onChange={(e) => setPlanterIdentifier(e.target.value)}
              />
              <TextField
                select
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
                  ...props.speciesState.speciesList,
                ].map((species) => (
                  <MenuItem key={species.id} value={species.id}>
                    {species.name}
                  </MenuItem>
                ))}
              </TextField>
              <Autocomplete
                classes={{
                  inputRoot: classes.autocompleteInputRoot,
                }}
                options={[
                  {
                    id: TAG_NOT_SET,
                    tagName: 'Not set',
                    active: true,
                    public: true,
                  },
                  ...props.tagsState.tagList,
                ]}
                value={tag}
                getOptionLabel={(tag) => tag.tagName}
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
              />
              {!userHasOrg && (
                <TextField
                  select
                  label="Organization"
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
                    ...props.organizationState.organizationList,
                  ].map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>
            <Grid className={classes.inputContainer}>
              <Button
                type="submit"
                className={classes.apply}
                variant="outlined"
                color="primary"
                onClick={(e) => handleSubmit(e)}
              >
                Apply
              </Button>
              <Button
                className={classes.apply}
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
    </React.Fragment>
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

//export default compose(
//  withStyles(styles, { withTheme: true, name: 'Filter' })
//)(Filter)
export default withStyles(styles)(
  connect(
    //state
    (state) => ({
      speciesState: state.species,
      tagsState: state.tags,
      organizationState: state.organizations,
    }),
    //dispatch
    (dispatch) => ({
      tagsDispatch: dispatch.tags,
      organizationDispatch: dispatch.organizations,
    }),
  )(Filter),
);
