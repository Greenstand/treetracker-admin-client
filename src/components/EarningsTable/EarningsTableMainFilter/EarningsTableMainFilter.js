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
    const { id, value } = e.target;
    const updatedFilter = { ...mainFilter, [id]: value };
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
              Payment System
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Payment System"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Visa</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.earningsFilterSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Grower Phone Number
            </InputLabel>

            <TextField
              id="phone"
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
            className={classes.earningsFilterSelectFormControl}
          >
            <TextField
              id="grower"
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
              onClick={handleOnFilterFormCancel}
              className={classes.earningTableFilterCancelButton}
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

export default EarningsTableMainFilter;

EarningsTableMainFilter.propTypes = {
  setIsMainFilterOpen: PropTypes.func.isRequired,
  triggerGetEarnings: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  isMainFilterOpen: PropTypes.bool.isRequired,
};
