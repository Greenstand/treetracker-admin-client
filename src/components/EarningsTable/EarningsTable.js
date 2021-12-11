import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import earningsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import useStyles from './EarningsTable.styles';

/**
 * @function
 * @name EarningsTableFilter
 * @description render filter UI for earnings table
 * @returns {React.Component}
 */
function EarningsTableFilter() {
  const classes = useStyles();

  return (
    <Grid item>
      <Grid container direction="column" justify="space-between">
        <FormControl
          variant="outlined"
          className={classes.earningsFIlterSelectFormControl}
        >
          <InputLabel id="demo-simple-select-outlined-label">Funder</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Funder"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Environment For Africa</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          className={classes.earningsFIlterSelectFormControl}
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
      </Grid>

      <Divider style={{ margin: '100px 0 20px 0' }} />

      <Grid
        container
        direction="column"
        className={classes.earningTableFilterActions}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.earningTableFilterSubmitButton}
        >
          APPLY
        </Button>
        <Button
          color="primary"
          variant="text"
          className={classes.earningTableFilterCancelButton}
        >
          CANCEL
        </Button>
      </Grid>
    </Grid>
  );
}

/**
 * @function
 * @name EarningsTableFilter
 * @description render date filter UI for earnings table
 * @param {object} props
 * @param {function} props.setIsDateFilterOpen - toggle open date filter
 * @param {boolean} props.isDateFilterOpen - flag determining if date filter is open/closed
 * @description render filter UI for earnings table
 * @returns {React.Component}
 */
function EarningsTableDateFilter(props) {
  const { isDateFilterOpen, setIsDateFilterOpen } = props;
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isDateFilterOpen}
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
                <Typography variant="h6">Filter By Effective Date</Typography>
                <Avatar className={classes.earningsTableFilterAvatar}>
                  <Typography variant="h6">1</Typography>
                </Avatar>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => setIsDateFilterOpen(false)}
              className={classes.earningsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end  date filter header */}

        {/* start filter body */}
        <Grid item>
          <Grid container direction="column" justify="space-between">
            <FormControl
              variant="outlined"
              className={classes.earningsFIlterSelectFormControl}
            >
              <TextField
                id="start_date"
                label="Start Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>

            <FormControl
              variant="outlined"
              className={classes.earningsFIlterSelectFormControl}
            >
              <TextField
                id="end_date"
                label="End Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>

          <Divider style={{ margin: '100px 0 20px 0' }} />

          <Grid
            container
            direction="column"
            className={classes.earningTableFilterActions}
          >
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className={classes.earningTableFilterSubmitButton}
            >
              APPLY
            </Button>
            <Button
              color="primary"
              variant="text"
              className={classes.earningTableFilterCancelButton}
            >
              CANCEL
            </Button>
          </Grid>
        </Grid>
        {/* end  filter body */}
      </Grid>
    </Drawer>
  );
}

EarningsTableDateFilter.propTypes = {
  setIsDateFilterOpen: PropTypes.func.isRequired,
  isDateFilterOpen: PropTypes.bool.isRequired,
};

/**
 * @function
 * @name EarningDetails
 * @description render details of an earning
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isDetailsDrawerOpen - flag that decides wheather details drawer should open/close
 * @param {Function} setIsDetailsDrawerOpen - closes earning details drawer when executed
 * @param {object} props.selectedEarning - earning object
 * @param {Function} props.setSelectedEarning - sets/resets selected earning object
 *
 * @returns {React.Component}
 */
function EarningDetails(props) {
  const { selectedEarning } = props;
  const classes = useStyles();

  return selectedEarning ? (
    <Grid item className={classes.earningDetailsContents}>
      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Grower</Typography>
          <Typography variant="b">{selectedEarning.grower}</Typography>
        </Grid>
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Funder</Typography>
          <Typography variant="b">{selectedEarning.funder}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="row">
        <Grid item sm={5}>
          <Typography>Amount</Typography>
          <Typography variant="b">{selectedEarning.amount} </Typography>
        </Grid>

        <Grid item>
          <Typography>Currency</Typography>
          <Typography variant="b">{selectedEarning.currency}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Status</Typography>
          <Typography variant="b">{selectedEarning.status}</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Typography>
            Effective Payment Date
            <InfoOutlinedIcon
              fontSize="large"
              className={classes.infoIconOutlined}
            />
          </Typography>
          <Typography variant="b">{selectedEarning.paid_at}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography variant="h6">Consolidation</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Consolidation Type</Typography>
          <Typography variant="b">Default</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Grid container direction="row">
            <Grid item sm={5}>
              <Typography>Start Date</Typography>
              <Typography variant="b">
                {selectedEarning.consolidation_period_start}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>End Date</Typography>
              <Typography variant="b">
                {selectedEarning.consolidation_period_end}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography variant="h6">Payment</Typography>
        </Grid>

        <Grid container direction="column" justify="space-between">
          <FormControl
            variant="outlined"
            className={classes.earningsFIlterSelectFormControl}
          >
            <TextField
              id="outlined-basic"
              label="Payment Confirmation Id"
              variant="outlined"
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.earningsFIlterSelectFormControl}
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
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Grid item>
            <Typography>Payment Confirmed by</Typography>
            <Typography variant="b">
              {selectedEarning.payment_confirmed_by}
            </Typography>
          </Grid>

          <Grid item className={classes.earningGrowerDetail}>
            <Typography>Payment confirmation method</Typography>
            <Typography variant="b">
              {selectedEarning.payment_confirmation_method}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid
        container
        direction="column"
        className={classes.earningTableFilterActions}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.earningTableFilterSubmitButton}
        >
          LOG PAYMENT
        </Button>
        <Button
          color="primary"
          variant="text"
          className={classes.earningTableFilterCancelButton}
        >
          CANCEL
        </Button>
      </Grid>
    </Grid>
  ) : (
    ''
  );
}

/**
 * @constant
 * @name earningTableMetaData
 * @description contains table meta data
 * @type {Object[]}
 * @param {string} earningTableMetaData[].name - earning property used to get earning property value from earning object to display in table
 * @param {string} earningTableMetaData[].description - column description/label to be displayed in table
 * @param {boolean} earningTableMetaData[].sortable - determines if column is sortable
 * @param {boolean} earningTableMetaData[].showInfoIcon - determines if column has info icon
 */
const earningTableMetaData = [
  {
    description: 'Grower',
    name: 'grower',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Funder',
    name: 'funder',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Amount',
    name: 'amount',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Effective Date',
    name: 'calculated_at',
    sortable: false,
    showInfoIcon: true,
  },
  {
    description: 'Payment Date',
    name: 'paid_at',
    sortable: false,
    showInfoIcon: false,
  },
];

export default function EarningsTable() {
  // state for earnings table
  const [earnings, setEarnings] = useState([]);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedEarning, setSelectedEarning] = useState(null);

  async function getEarnings(...args) {
    const response = await earningsAPI.getEarnings(...args);
    setEarnings(response.earnings);
    setTotalEarnings(response.totalCount);
  }

  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  return (
    <CustomTable
      data={earnings}
      totalCount={totalEarnings}
      openDateFilter={handleOpenDateFilter}
      handleGetData={getEarnings}
      setSelectedRow={setSelectedEarning}
      selectedRow={selectedEarning}
      tableMetaData={earningTableMetaData}
      headerTitle="Earnings"
      filter={<EarningsTableFilter />}
      dateFilter={
        <EarningsTableDateFilter
          isDateFilterOpen={isDateFilterOpen}
          setIsDateFilterOpen={setIsDateFilterOpen}
        />
      }
      rowDetails={<EarningDetails selectedEarning={selectedEarning} />}
      actionButtonType="export"
    />
  );
}
