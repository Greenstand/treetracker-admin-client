import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {
  ALL_ORGANIZATIONS,
  ORGANIZATION_NOT_SET,
  // TAG_NOT_SET,
} from 'models/Filter';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  getDatePickerLocale,
  getDateFormatLocale,
  // convertDateToDefaultSqlDate,
} from 'common/locale';
import { datePickerDefaultMinDate } from 'common/variables';
import { AppContext } from 'context/AppContext';
import { CaptureMatchingContext } from 'context/CaptureMatchingContext';

export const FILTER_WIDTH = 330;

const styles = (theme) => {
  return {
    root: {
      position: 'absolute',
      right: 0,
      width: '200px',
      top: '43px',
      backgroundColor: '#f5f5f5',
      height: 'calc(100vh - 43px)',
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    },
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
    gridContainer: {
      height: 'calc(100vh - 43px)',
      display: 'flex',
      justifyContent: 'space-between',
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
      width: '90',
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
  const {
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    organizationId,
    setOrganizationId,
  } = useContext(CaptureMatchingContext);
  const { orgList, userHasOrg } = useContext(AppContext);
  const { classes } = props;
  const dateStartDefault = null;
  const dateEndDefault = null;
  const handleDateStartChange = (date) => {
    setDateStart(date);
  };

  const handleDateEndChange = (date) => {
    setDateEnd(date);
  };

  // const formatDate = (date) => {
  //   return convertDateToDefaultSqlDate(date);
  // };

  function handleSubmit(e) {
    e.preventDefault();
    // save the filer to context for editing & submit
  }

  function handleReset() {
    // reset form values, except 'approved' and 'active' which we'll keep
    setDateStart(dateStartDefault);
    setDateEnd(dateEndDefault);
    setOrganizationId(ALL_ORGANIZATIONS);
  }

  const defaultOrgList = userHasOrg
    ? [
        {
          id: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
      ]
    : [
        {
          id: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
        {
          id: ORGANIZATION_NOT_SET,
          name: 'Not set',
          value: null,
        },
      ];

  return (
    <>
      {
        <form onSubmit={handleSubmit} className={classes.root}>
          <Grid
            container
            wrap="nowrap"
            direction="column"
            className={classes.gridContainer}
          >
            <Grid item className={classes.inputContainer} direction="column">
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
              {
                /* {!userHasOrg && ( }*/
                <TextField
                  data-testid="org-dropdown"
                  select
                  label="Organization"
                  htmlFor="organization"
                  id="organization"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
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
