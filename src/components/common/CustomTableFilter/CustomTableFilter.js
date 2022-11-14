import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';

import SelectOrg from '../SelectOrg';
import useStyles from './CustomTableFilter.styles';
import { AppContext } from '../../../context/AppContext';
import { ALL_ORGANIZATIONS } from '../../../models/Filter';

const PAYMENT_STATUS = ['calculated', 'cancelled', 'paid', 'all'];

/**
 * @function
 * @name CustomTableFilter
 * @description render date filter UI for custom table
 * @param {object} props
 * @param {function} props.setIsFilterOpen - toggle open  filter
 * @param {function} props.setFilter - set  filter
 * @param {object} props.filter -  filter object
 * @param {string} props.filterType -  filter type, either 'main' or 'date'
 * @param {boolean} props.isFilterOpen - flag determining if filter is open/closed
 * @param {boolean} props.disablePaymentStatus -
 * @returns {React.Component}
 */
function CustomTableFilter(props) {
  // console.warn('orgList', orgList);
  const initialFilter = {
    // organization_id: '',
    grower: '',
    payment_status: 'all',
    earnings_status: 'all',
    phone: '',
  };
  const [localFilter, setLocalFilter] = useState(initialFilter);
  const {
    isFilterOpen,
    setIsFilterOpen,
    filter,
    setFilter,
    filterType,
    disablePaymentStatus,
  } = props;

  const classes = useStyles();
  const { updateSelectedFilter } = useContext(AppContext);

  const handleOnFormControlChange = (e) => {
    let updatedFilter = { ...localFilter };
    if (e?.target) {
      e.preventDefault();
      const { name, value } = e.target;
      updatedFilter = { ...updatedFilter, [name]: value };
    } else {
      updatedFilter = {
        ...updatedFilter,
        organization_id: e?.id || ALL_ORGANIZATIONS,
        sub_organization: e?.stakeholder_uuid || ALL_ORGANIZATIONS,
      };
    }

    setLocalFilter(updatedFilter);
  };

  const handleOnFilterFormSubmit = (e) => {
    e.preventDefault();
    const filtersToSubmit = {
      ...filter,
      grower: localFilter.grower ? localFilter.grower.trim() : undefined,
      phone: localFilter.phone ? localFilter.phone.trim() : undefined,
      payment_status: disablePaymentStatus
        ? undefined
        : localFilter.payment_status,
    };

    if (filtersToSubmit.organization_id === ALL_ORGANIZATIONS) {
      const modifiedFiltersToSubmit = {
        ...filtersToSubmit,
        organization_id: '',
        sub_organization: '',
      };
      setFilter(modifiedFiltersToSubmit);
      setIsFilterOpen(false);
      updateSelectedFilter({
        modifiedFiltersToSubmit,
      });
    } else {
      setFilter(filtersToSubmit);
      setIsFilterOpen(false);
      updateSelectedFilter(filtersToSubmit);
    }
  };

  const handleOnFilterFormReset = (e) => {
    e.preventDefault();
    disablePaymentStatus
      ? setFilter({
          payment_status: undefined,
          grower: undefined,
        })
      : setFilter({ ...initialFilter, grower: '' });
    setLocalFilter(initialFilter);
    setIsFilterOpen(false);
  };

  const renderDateFilter = () => (
    <>
      <FormControl
        variant="outlined"
        className={classes.customTableFilterSelectFormControl}
      >
        <TextField
          id="start_date"
          name="start_date"
          value={localFilter?.start_date}
          label="Start Date"
          type="date"
          onChange={handleOnFormControlChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>

      <FormControl
        variant="outlined"
        className={classes.customTableFilterSelectFormControl}
      >
        <TextField
          id="end_date"
          name="end_date"
          label="End Date"
          value={localFilter?.end_date}
          onChange={handleOnFormControlChange}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>
    </>
  );

  const renderMainFilter = () => (
    <>
      {!disablePaymentStatus && (
        <FormControl
          variant="outlined"
          className={classes.customTableFilterSelectFormControl}
        >
          <InputLabel id="earnings_status">Payment Status</InputLabel>
          <Select
            labelId="earnings_status"
            defaultValue={localFilter?.earnings_status}
            id="earnings_status"
            name="earnings_status"
            label="Payment Status"
            onChange={handleOnFormControlChange}
          >
            {PAYMENT_STATUS.map((paymentStatus, i) => (
              <MenuItem key={`${paymentStatus}_${i}`} value={paymentStatus}>
                <span style={{ textTransform: 'capitalize' }}>
                  {paymentStatus}
                </span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {!disablePaymentStatus && (
        <FormControl
          variant="outlined"
          className={classes.customTableFilterSelectFormControl}
        >
          <SelectOrg
            orgId={localFilter?.organization_id}
            defaultOrgs={[
              {
                id: ALL_ORGANIZATIONS,
                stakeholder_uuid: ALL_ORGANIZATIONS,
                name: 'All',
                value: 'All',
              },
            ]}
            handleSelection={handleOnFormControlChange}
          />
        </FormControl>
      )}

      <FormControl
        variant="outlined"
        className={classes.customTableFilterSelectFormControl}
      >
        <TextField
          id="phone"
          name="phone"
          htmlFor="phone"
          label="Grower Phone Number"
          placeholder="Grower Phone Number"
          value={localFilter?.phone}
          type="text"
          onChange={handleOnFormControlChange}
        />
      </FormControl>

      <FormControl
        variant="outlined"
        className={classes.customTableFilterSelectFormControl}
      >
        <TextField
          id="grower"
          name="grower"
          htmlFor="grower"
          label="Grower Name"
          placeholder="Grower Name"
          value={localFilter?.grower}
          onChange={handleOnFormControlChange}
          type="text"
        />
      </FormControl>
    </>
  );

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
    >
      <Grid
        container
        direction="column"
        className={classes.customTableFilterForm}
      >
        {/* start  filter header */}
        <Grid item className={classes.customTableFilterHeader}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              <Grid container direction="row">
                <Typography variant="h6">Filter</Typography>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => setIsFilterOpen(false)}
              className={classes.customTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end   filter header */}

        {/* start filter body */}
        <form onSubmit={handleOnFilterFormSubmit}>
          {filterType === 'date' && renderDateFilter()}
          {filterType === 'main' && renderMainFilter()}

          {/* add select input */}

          <Divider style={{ margin: '50px 0 20px 0' }} />

          <Grid
            container
            direction="column"
            className={classes.customTableFilterActions}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disableElevation
              className={classes.customTableFilterSubmitButton}
            >
              APPLY
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={(e) => handleOnFilterFormReset(e)}
              className={classes.customTableFilterResetButton}
            >
              RESET
            </Button>
          </Grid>
        </form>
        {/* end  filter body */}
      </Grid>
    </Drawer>
  );
}

export default CustomTableFilter;

CustomTableFilter.propTypes = {
  setIsFilterOpen: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  filterType: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
};
