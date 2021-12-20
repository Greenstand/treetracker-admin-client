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
import useStyles from './PaymentsTableMainFilter.styles';

/**
 * @function
 * @name PaymentsTableFilter
 * @description render date filter UI for payments table
 * @param {object} props
 * @param {function} props.setIsMainFilterOpen - toggle open date filter
 * @param {function} props.setFilter - set date filter
 * @param {function} props.triggerGetPayments - trigger get payments api
 * @param {object} props.filter - payments filter object
 * @param {boolean} props.isMainFilterOpen - flag determining if date filter is open/closed
 * @returns {React.Component}
 */
function PaymentsTableMainFilter(props) {
  const [mainFilter, setMainFilter] = useState({});
  const { isMainFilterOpen, setIsMainFilterOpen, filter, setFilter } = props;

  const classes = useStyles();

  const handleOnFormControlChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const updatedFilter = { ...mainFilter, [name]: value };
    setMainFilter(updatedFilter);
  };

  const handleOnFilterFormSubmit = (e) => {
    e.preventDefault();
    setFilter({ ...filter, ...mainFilter });
    setIsMainFilterOpen(false);
  };

  const handleOnFilterFormCancel = (e) => {
    e.preventDefault();
    if (Object.keys(mainFilter).length !== 0) {
      const { phone, grower, ...withoutMainFilter } = filter;
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
        className={classes.paymentsTableFilterForm}
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
              className={classes.paymentsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end  date filter header */}

        {/* start filter body */}
        <form onSubmit={handleOnFilterFormSubmit}>
          <FormControl
            variant="outlined"
            className={classes.paymentsFilterSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Payment System
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="payment_system"
              name="payment_system"
              label="Payment System"
              onChange={handleOnFormControlChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="visa">Visa</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.paymentsFilterSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Grower Phone Number
            </InputLabel>

            <TextField
              id="phone"
              name="phone"
              value={mainFilter?.phone}
              type="text"
              onChange={handleOnFormControlChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.paymentsFilterSelectFormControl}
          >
            <TextField
              id="grower"
              name="grower"
              label="Grower Name"
              value={mainFilter?.grower}
              onChange={handleOnFormControlChange}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

          {/* add select input */}

          <Divider style={{ margin: '50px 0 20px 0' }} />

          <Grid
            container
            direction="column"
            className={classes.paymentTableFilterActions}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disableElevation
              className={classes.paymentTableFilterSubmitButton}
            >
              APPLY
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={handleOnFilterFormCancel}
              className={classes.paymentTableFilterCancelButton}
            >
              CANCEL
            </Button>
          </Grid>
        </form>
        {/* end  filter body */}
      </Grid>
    </Drawer>
  );
}

export default PaymentsTableMainFilter;

PaymentsTableMainFilter.propTypes = {
  setIsMainFilterOpen: PropTypes.func.isRequired,
  triggerGetPayments: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  isMainFilterOpen: PropTypes.bool.isRequired,
};
