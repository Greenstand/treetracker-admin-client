import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './PaymentsTableDateFilter.styles';

/**
 * @function
 * @name PaymentsTableFilter
 * @description render date filter UI for payments table
 * @param {object} props
 * @param {function} props.setIsDateFilterOpen - toggle open date filter
 * @param {function} props.setFilter - set date filter
 * @param {function} props.triggerGetPayments - trigger get payments api
 * @param {object} props.filter - payments filter object
 * @param {boolean} props.isDateFilterOpen - flag determining if date filter is open/closed
 * @returns {React.Component}
 */
function PaymentsTableDateFilter(props) {
  const [dateFilter, setDateFilter] = useState({});
  const { isDateFilterOpen, setIsDateFilterOpen, filter, setFilter } = props;

  const classes = useStyles();

  const handleOnFormControlChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    const updatedFilter = { ...dateFilter, [id]: value };
    setDateFilter(updatedFilter);
  };

  const handleOnFilterFormSubmit = (e) => {
    e.preventDefault();
    setFilter({ ...filter, ...dateFilter });
    setIsDateFilterOpen(false);
  };

  const handleOnFilterFormReset = (e) => {
    e.preventDefault();
    if (Object.keys(dateFilter).length !== 0) {
      const withoutDateFilter = Object.assign({}, filter);
      delete withoutDateFilter.start_date;
      delete withoutDateFilter.end_date;

      setFilter(withoutDateFilter);
      setDateFilter({});
    }
    setIsDateFilterOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isDateFilterOpen}
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
                <Typography variant="h6">Filter By Effective Date</Typography>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => setIsDateFilterOpen(false)}
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
            <TextField
              id="start_date"
              value={dateFilter?.start_date}
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
            className={classes.paymentsFilterSelectFormControl}
          >
            <TextField
              id="end_date"
              label="End Date"
              value={dateFilter?.end_date}
              onChange={handleOnFormControlChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

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
              onClick={handleOnFilterFormReset}
              className={classes.paymentTableFilterResetButton}
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

export default PaymentsTableDateFilter;

PaymentsTableDateFilter.propTypes = {
  setIsDateFilterOpen: PropTypes.func.isRequired,
  triggerGetPayments: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  isDateFilterOpen: PropTypes.bool.isRequired,
};
