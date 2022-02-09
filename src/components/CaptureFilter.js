import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
  verificationStatesArr,
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
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const { classes, filter = new FilterModel() } = props;
  const filterOptionAll = 'All';
  const dateStartDefault = null;
  const dateEndDefault = null;
  const [uuid, setUUID] = useState(filter?.uuid || '');
  const [captureId, setCaptureId] = useState(filter?.captureId || '');
  const [growerId, setGrowerId] = useState(filter?.planterId || '');
  const [deviceId, setDeviceId] = useState(filter?.deviceIdentifier || '');
  const [growerIdentifier, setGrowerIdentifier] = useState(
    filter?.planterIdentifier || ''
  );
  const [verifyStatus, setVerifyStatus] = useState([
    { active: true, approved: true },
    { active: true, approved: false },
  ]);
  const [dateStart, setDateStart] = useState(
    filter?.dateStart || dateStartDefault
  );
  const [dateEnd, setDateEnd] = useState(filter?.dateEnd || dateEndDefault);
  const [speciesId, setSpeciesId] = useState(filter?.speciesId || ALL_SPECIES);
  const [tag, setTag] = useState(null);
  const [tagSearchString, setTagSearchString] = useState('');
  const [organizationId, setOrganizationId] = useState(
    filter.organizationId || ALL_ORGANIZATIONS
  );
  const [stakeholderUUID, setStakeholderUUID] = useState(
    filter.stakeholderUUID || ALL_ORGANIZATIONS
  );
  const [tokenId, setTokenId] = useState(filter?.tokenId || filterOptionAll);
  const [verificationStatus, setVerificationStatus] = useState([
    verificationStates.APPROVED,
    verificationStates.AWAITING,
  ]);
  const isAllVerification =
    verificationStatus.length &&
    verificationStatus.length === verificationStatesArr.length;

  const handleDateStartChange = (date) => {
    setDateStart(date);
  };

  const handleDateEndChange = (date) => {
    setDateEnd(date);
  };

  const formatDate = (date) => {
    return convertDateToDefaultSqlDate(date);
  };

  const handleVerificationStatusChange = (event) => {
    let value = event.target.value;
    let status = [];
    if (
      value[value.length - 1] === 'all' ||
      (value.length === 3 && value[value.length - 1] !== 'all')
    ) {
      setVerificationStatus(
        verificationStatus.length === verificationStatesArr.length
          ? []
          : verificationStatesArr
      );
      value = verificationStatesArr;
    } else {
      setVerificationStatus(value);
    }
    value.forEach((val) => {
      if (val === verificationStates.APPROVED) {
        status.push({ active: true, approved: true });
      } else if (val === verificationStates.AWAITING) {
        status.push({ active: true, approved: false });
      } else if (val === verificationStates.REJECTED) {
        status.push({ active: false, approved: false });
      }
    });
    setVerifyStatus(status);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // save the filer to context for editing & submit
    const filter = new FilterModel();
    filter.uuid = uuid;
    filter.captureId = captureId;
    filter.planterId = growerId;
    filter.deviceIdentifier = deviceId;
    filter.planterIdentifier = growerIdentifier;
    filter.dateStart = dateStart ? formatDate(dateStart) : undefined;
    filter.dateEnd = dateEnd ? formatDate(dateEnd) : undefined;
    filter.speciesId = speciesId;
    filter.tagId = tag ? tag.id : 0;
    filter.organizationId = organizationId;
    filter.stakeholderUUID = stakeholderUUID;
    filter.tokenId = tokenId;
    filter.verifyStatus = verifyStatus;
    props.onSubmit && props.onSubmit(filter);
  }

  function handleReset() {
    // reset form values, except 'approved' and 'active' which we'll keep
    setUUID('');
    setCaptureId('');
    setGrowerId('');
    setDeviceId('');
    setGrowerIdentifier('');
    setDateStart(dateStartDefault);
    setDateEnd(dateEndDefault);
    setSpeciesId(ALL_SPECIES);
    setTag(null);
    setTagSearchString('');
    setOrganizationId(ALL_ORGANIZATIONS);
    setStakeholderUUID(ALL_ORGANIZATIONS);
    setTokenId(filterOptionAll);
    setVerifyStatus([
      { active: true, approved: true },
      { active: true, approved: false },
    ]);
    const filter = new FilterModel();
    props.onSubmit && props.onSubmit(filter);
  }

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
                select
                htmlFor="verification-status"
                id="verification-status"
                label="Verification Status"
                SelectProps={{
                  multiple: true,
                  value: verificationStatus,
                  onChange: handleVerificationStatusChange,
                  renderValue: (verificationStatus) =>
                    verificationStatus.join(', '),
                }}
              >
                <MenuItem value="all">
                  <ListItemIcon>
                    <Checkbox
                      checked={
                        isAllVerification === 0 ? false : isAllVerification
                      }
                      indeterminate={
                        verificationStatus.length > 0 &&
                        verificationStatus.length < verificationStatesArr.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary="Select All" />
                </MenuItem>
                {verificationStatesArr.map((name) => (
                  <MenuItem key={name} value={name}>
                    <ListItemIcon>
                      <Checkbox
                        checked={verificationStatus.indexOf(name) > -1}
                      />
                    </ListItemIcon>
                    <ListItemText primary={name} />
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
                htmlFor="grower-id"
                id="grower-id"
                label="Grower ID"
                placeholder="e.g. 7"
                value={growerId}
                onChange={(e) => setGrowerId(e.target.value)}
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
                label="Grower Identifier"
                placeholder="e.g. grower@example.com"
                value={growerIdentifier}
                onChange={(e) => setGrowerIdentifier(e.target.value)}
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
                  ...tagsContext.tagList.filter((t) =>
                    t.tagName
                      .toLowerCase()
                      .startsWith(tagSearchString.toLowerCase())
                  ),
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
              {
                /* {!userHasOrg && ( }*/
                <TextField
                  data-testid="org-dropdown"
                  select
                  label="Organization"
                  htmlFor="organization"
                  id="organization"
                  value={organizationId}
                  onChange={(e) => {
                    const org = orgList.find((o) => o.id === e.target.value);
                    setStakeholderUUID(
                      org ? org.stakeholder_uuid : e.target.value
                    );
                    setOrganizationId(e.target.value);
                  }}
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
