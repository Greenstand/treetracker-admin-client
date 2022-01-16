import React, { useState } from 'react';
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
import useStyles from './EarningsTableMainFilter.styles';

const PAYMENT_STATUS = ['paid', 'calculated', 'cancled', 'all'];

/**
 * @function
 * @name EarningsTableFilter
 * @description render date filter UI for earnings table
 * @param {object} props
 * @param {function} props.setIsMainFilterOpen - toggle open date filter
 * @param {function} props.setFilter - set date filter
 * @param {function} props.triggerGetEarnings - trigger get earnings api
 * @param {object} props.filter - earnings filter object
 * @param {boolean} props.isMainFilterOpen - flag determining if date filter is open/closed
 * @returns {React.Component}
 */
function EarningsTableMainFilter(props) {
  const [mainFilter, setMainFilter] = useState({});
  const { isMainFilterOpen, setIsMainFilterOpen, filter, setFilter } = props;

  const classes = useStyles();

  const handleOnFormControlChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const updatedFilter = { ...mainFilter, [name]: value };
    console.log(updatedFilter);
    setMainFilter(updatedFilter);
  };

  const handleOnFilterFormSubmit = (e) => {
    e.preventDefault();
    const filtersToSubmit = { ...filter, ...mainFilter };
    Object.keys(filtersToSubmit).forEach(
      (k) => filtersToSubmit[k] == 'all' && delete filtersToSubmit[k]
    ); // filter our keys we don't want to submit
    setFilter(filtersToSubmit);
    setIsMainFilterOpen(false);
  };

  const handleOnFilterFormReset = (e) => {
    e.preventDefault();
    if (Object.keys(mainFilter).length !== 0) {
      const withoutMainFilter = Object.assign({}, filter);
      delete withoutMainFilter.payment_system;
      delete withoutMainFilter.grower;
      delete withoutMainFilter.phone;
      setFilter(withoutMainFilter);
      setMainFilter({});
    }
    setIsMainFilterOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isMainFilterOpen}
    >
      <Grid
        container
        direction="column"
        className={classes.earningsTableFilterForm}
      >
        {/* start date filter header */}
        <Grid item className={classes.dateFilterHeader}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Grid container direction="row">
                <Typography variant="h6">Filter</Typography>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => setIsMainFilterOpen(false)}
              className={classes.earningsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end  date filter header */}

        {/* start filter body */}
        <form onSubmit={handleOnFilterFormSubmit}>
          <FormControl
            variant="outlined"
            className={classes.earningsFilterSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Payment Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
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
            className={classes.earningsFilterSelectFormControl}
          >
            <TextField
              id="phone"
              name="phone"
              htmlFor="phone"
              label="Grower Phone Number"
              placeholder="Grower Phone Number"
              value={mainFilter?.phone}
              type="text"
              onChange={handleOnFormControlChange}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.earningsFilterSelectFormControl}
          >
            <TextField
              id="grower"
              name="grower"
              htmlFor="grower"
              label="Grower Name"
              placeholder="Grower Name"
              value={mainFilter?.grower}
              onChange={handleOnFormControlChange}
              type="text"
            />
          </FormControl>

          {/* add select input */}

          <Divider style={{ margin: '50px 0 20px 0' }} />

          <Grid
            container
            direction="column"
            className={classes.earningTableFilterActions}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disableElevation
              className={classes.earningTableFilterSubmitButton}
            >
              APPLY
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={handleOnFilterFormReset}
              className={classes.earningTableFilterResetButton}
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

export default EarningsTableMainFilter;

EarningsTableMainFilter.propTypes = {
  setIsMainFilterOpen: PropTypes.func.isRequired,
  triggerGetEarnings: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  isMainFilterOpen: PropTypes.bool.isRequired,
};
