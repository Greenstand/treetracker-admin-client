import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../../api/treeTrackerApi';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './CustomTableFilter.styles';
import { AppContext } from '../../../context/AppContext';

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
 * @returns {React.Component}
 */
function CustomTableFilter(props) {
  const [localFilter, setLocalFilter] = useState({});
  const [organisations, setOrganisations] = useState([]);
  const {
    isFilterOpen,
    setIsFilterOpen,
    filter,
    setFilter,
    filterType,
  } = props;

  const classes = useStyles();
  const { updateSelectedFilter } = React.useContext(AppContext);

  const handleOnFormControlChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const updatedFilter = { ...localFilter, [name]: value };
    console.log(updatedFilter);
    setLocalFilter(updatedFilter);
  };

  const handleOnFilterFormSubmit = (e) => {
    e.preventDefault();
    const filtersToSubmit = { ...filter, ...localFilter };
    Object.keys(filtersToSubmit).forEach(
      (k) =>
        (filtersToSubmit[k] === 'all' || filtersToSubmit[k] === '') &&
        delete filtersToSubmit[k]
    ); // filter out keys we don't want to submit
    setFilter(filtersToSubmit);
    setIsFilterOpen(false);
    updateSelectedFilter(filtersToSubmit);
  };

  const handleOnFilterFormReset = (e) => {
    e.preventDefault();
    if (Object.keys(localFilter).length !== 0) {
      const withoutLocalFilter = Object.assign({}, filter);
      delete withoutLocalFilter.earnings_status;
      delete withoutLocalFilter.funder_id;
      delete withoutLocalFilter.grower;
      delete withoutLocalFilter.phone;
      delete withoutLocalFilter.start_date;
      delete withoutLocalFilter.end_date;
      setFilter(withoutLocalFilter);
      setLocalFilter({});
    }
    setIsFilterOpen(false);
  };

  useEffect(() => {
    api
      .getOrganizations()
      .then((res) => {
        setOrganisations(res);
      })
      .catch((err) => console.log(err));
  }, [localFilter]);

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

      <FormControl
        variant="outlined"
        className={classes.customTableFilterSelectFormControl}
      >
        <InputLabel id="funder_id">Organisation</InputLabel>
        <Select
          labelId="funder_id"
          defaultValue={localFilter?.funder_id}
          id="funder_id"
          name="funder_id"
          label="Organisation"
          onChange={handleOnFormControlChange}
        >
          {organisations.map((organisation, i) => (
            <MenuItem
              key={`${organisation.id}_${i}`}
              value={organisation.stakeholder_uuid}
            >
              <span style={{ textTransform: 'capitalize' }}>
                {organisation.name}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
    >
      <Grid
        container
        direction="column"
        className={classes.customTableFilterForm}
      >
        {/* start  filter header */}
        <Grid item className={classes.customTableFilterHeader}>
          <Grid container direction="row" justify="space-between">
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
              onClick={handleOnFilterFormReset}
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
