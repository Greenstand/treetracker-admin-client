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
  TAG_NOT_SET
} from '../models/Filter';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { getDatePickerLocale, getDateFormatLocale, convertDateToDefaultSqlDate } from '../common/locale'
import { getOrganization } from '../api/apiUtils';

export const FILTER_WIDTH = 330;

const styles = theme => {
  return {
    root: {},
    drawer: {
      flexShrink: 0
    },
    drawerPaper: {
      width: FILTER_WIDTH,
      padding: theme.spacing(3, 2, 2, 2)
      /*
       * boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
       * */
    },
    close: {
      color: theme.palette.grey[500]
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
  const { classes, filter } = props;
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [treeId, setTreeId] = useState(filter.treeId);
  const [planterId, setPlanterId] = useState(filter.planterId);
  const [deviceId, setDeviceId] = useState(filter.deviceId);
  const [planterIdentifier, setPlanterIdentifier] = useState(
    filter.planterIdentifier
  );
  const [approved, setApproved] = useState(filter.approved);
  const [active, setActive] = useState(filter.active);
  const [dateStart, setDateStart] = useState(
    filter.dateStart || dateStartDefault
  );
  const [dateEnd, setDateEnd] = useState(filter.dateEnd || dateEndDefault);
  const [speciesId, setSpeciesId] = useState(ALL_SPECIES);
  const [tagId, setTagId] = useState(0);
  const [tagSearchString, setTagSearchString] = useState('');
  const [organizationId, setOrganizationId] = useState(ALL_ORGANIZATIONS);

  useEffect(() => {
    props.tagsDispatch.getTags(tagSearchString)
  }, [tagSearchString, props.tagsDispatch])

  useEffect(() => {
    props.organizationDispatch.loadOrganizations()
  }, [props.organizationDispatch])

  const handleDateStartChange = date => {
    setDateStart(date);
  };

  const handleDateEndChange = date => {
    setDateEnd(date);
  };

  const formatDate = date => {
    return convertDateToDefaultSqlDate(date);
  };

  function handleSubmit() {
    const filter = new FilterModel();
    filter.treeId = treeId;
    filter.planterId = planterId;
    filter.deviceId = deviceId;
    filter.planterIdentifier = planterIdentifier;
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined;
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined;
    filter.approved = approved;
    filter.active = active;
    filter.speciesId = speciesId;
    filter.tagId = tagId;
    filter.organizationId = organizationId;
    props.onSubmit && props.onSubmit(filter);
  }

  return (
    <React.Fragment>
      {
        <Grid container wrap='nowrap' direction='row'>
          <Grid item className={classes.inputContainer}>
            <TextField
              select
              label='Approved'
              value={
                approved === undefined ? 'All' : approved === true ? 'true' : 'false'
              }
              onChange={e =>
                setApproved(
                  e.target.value === 'All'
                    ? undefined
                    : e.target.value === 'true'
                      ? true
                      : false
                )
              }
            >
              {['All', 'true', 'false'].map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label='Rejected'
              value={
                active === undefined ? 'All' : active === true ? 'false' : 'true'
              }
              InputLabelProps={{
                shrink: true
              }}
              onChange={e =>
                setActive(
                  e.target.value === 'All'
                    ? undefined
                    : e.target.value === 'true'
                      ? false
                      : true
                )
              }
            >
              {['All', 'false', 'true'].map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDatePickerLocale()}>
              <KeyboardDatePicker
                margin='normal'
                id='start-date-picker'
                label='Start Date'
                format={getDateFormatLocale(true)}
                value={dateStart}
                onChange={handleDateStartChange}
                maxDate={dateEnd}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
              <KeyboardDatePicker
                margin='normal'
                id='end-date-picker'
                label='End Date'
                format={getDateFormatLocale(true)}
                value={dateEnd}
                onChange={handleDateEndChange}
                minDate={dateStart}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              label='Planter ID'
              placeholder='e.g. 7'
              value={planterId}
              onChange={e => setPlanterId(e.target.value)}
            />
            <TextField
              label='Tree ID'
              placeholder='e.g. 80'
              value={treeId}
              onChange={e => setTreeId(e.target.value)}
            />
            <TextField
              label='Device ID'
              placeholder='e.g. 123456'
              value={deviceId}
              onChange={e => setDeviceId(e.target.value)}
            />
            <TextField
              label='Planter Identifier'
              placeholder='e.g. planter@example.com'
              value={planterIdentifier}
              onChange={e => setPlanterIdentifier(e.target.value)}
            />
            <TextField
              select
              label='Species'
              value={speciesId}
              onChange={e => setSpeciesId(e.target.value)}
            >
              {[
                { id: ALL_SPECIES, name: 'All' },
                { id: SPECIES_NOT_SET, name: 'Not set' },
                ...props.speciesState.speciesList
              ].map(species => (
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
                { id: TAG_NOT_SET, tagName: 'Not set', active: true, public: true },
                ...props.tagsState.tagList
              ]}
              getOptionLabel={(tag) => tag.tagName}
              onChange={(_oldVal, newVal) => {
                console.log(newVal)
                setTagId(newVal && newVal.id)
              }}
              onInputChange={(_oldVal, newVal) => {
                setTagSearchString(newVal)
              }}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label='Tag'
                  value={tagId}
                  onChange={e => setTagId(e.target.value)}
                />
              }
            />
            {!getOrganization() && <TextField
              select
              label='Organization'
              value={organizationId}
              onChange={e => setOrganizationId(e.target.value)}
            >
              {[
                { id: ALL_ORGANIZATIONS, name: 'All' },
                { id: ORGANIZATION_NOT_SET, name: 'Not set' },
                ...props.organizationState.organizationList
              ].map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>}
          </Grid>
          <Grid className={classes.inputContainer}>
            <Button
              className={classes.apply}
              variant='outlined' color='primary' onClick={handleSubmit}>
              Apply
            </Button>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )

}

//export default compose(
//  withStyles(styles, { withTheme: true, name: 'Filter' })
//)(Filter)
export default withStyles(styles)(connect(
  //state
  state => ({
    speciesState: state.species,
    tagsState: state.tags,
    organizationState: state.organizations,
  }),
  //dispatch
  dispatch => ({
    tagsDispatch: dispatch.tags,
    organizationDispatch: dispatch.organizations,
  }),
)(Filter));
