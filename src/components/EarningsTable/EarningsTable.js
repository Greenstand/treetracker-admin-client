import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import earningsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import useStyles from './EarningsTable.styles';
import { covertDateStringToHumanReadableFormat } from 'utilities';
import EarningsTableDateFilter from './EarningsTableDateFilter/EarningsTableDateFilter';
import EarningsTableMainFilter from './EarningsTableMainFilter/EarningsTableMainFilter';

/**
 * @function
 * @name generateActiveDateRangeFilterString
 * @description generate active date rage filter string e.g. 'Oct 1 - Oct 31'
 * @param {string} startDate - start date
 * @param {string} endDate - end date
 *
 * @returns {string} - active date range filter string
 */
const generateActiveDateRangeFilterString = (startDate, endDate) => {
  const format = 'mmm d';

  const startDateString = covertDateStringToHumanReadableFormat(
    startDate,
    format,
  );
  const endDateString = covertDateStringToHumanReadableFormat(endDate, format);

  return `${startDateString} - ${endDateString}`;
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
            className={classes.earningsFilterSelectFormControl}
          >
            <TextField
              id="outlined-basic"
              label="Payment Confirmation Id"
              variant="outlined"
            />
          </FormControl>

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

/**
 * @function
 * @name prepareRows
 * @description transform rows such that are well formated compatible with the table meta data
 * @param {object} rows - rows to be transformed
 * @returns {Array} - transformed rows
 */
const prepareRows = (rows) =>
  rows.map((row) => {
    const {
      id,
      grower,
      currency,
      funder,
      amount,
      payment_system,
      paid_at,
      calculated_at,
    } = row;
    return {
      id,
      grower,
      currency,
      funder,
      amount,
      payment_system,
      paid_at,
      calculated_at: covertDateStringToHumanReadableFormat(calculated_at),
    };
  });

export default function EarningsTable() {
  // state for earnings table
  const [earnings, setEarnings] = useState([]);
  const [activeDateRageString, setActiveDateRageString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [earningsPerPage, setEarningsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedEarning, setSelectedEarning] = useState(null);

  async function getEarnings() {
    setIsLoading(true); // show loading indicator when fetching data

    const queryParams = {
      offset: page * earningsPerPage,
      sort_by: sortBy?.field,
      order: sortBy?.order,
      limit: earningsPerPage,
      ...filter,
    };

    const response = await earningsAPI.getEarnings(queryParams);
    const result = prepareRows(response.earnings);
    setEarnings(result);
    setTotalEarnings(response.totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  useEffect(() => {
    if (filter?.start_date && filter?.end_date) {
      const dateRangeString = generateActiveDateRangeFilterString(
        filter?.start_date,
        filter?.end_date,
      );
      setActiveDateRageString(dateRangeString);
    } else {
      setActiveDateRageString('');
    }

    getEarnings();
  }, [page, earningsPerPage, sortBy, filter]);

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  return (
    <CustomTable
      data={earnings}
      setPage={setPage}
      page={page}
      sortBy={sortBy}
      rows={earnings}
      isLoading={isLoading}
      activeDateRage={activeDateRageString}
      setRowsPerPage={setEarningsPerPage}
      rowsPerPage={earningsPerPage}
      setSortBy={setSortBy}
      totalCount={totalEarnings}
      openMainFilter={handleOpenMainFilter}
      openDateFilter={handleOpenDateFilter}
      handleGetData={getEarnings}
      setSelectedRow={setSelectedEarning}
      selectedRow={selectedEarning}
      tableMetaData={earningTableMetaData}
      headerTitle="Earnings"
      mainFilterComponent={
        <EarningsTableMainFilter
          isMainFilterOpen={isMainFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsMainFilterOpen={setIsMainFilterOpen}
        />
      }
      dateFilterComponent={
        <EarningsTableDateFilter
          isDateFilterOpen={isDateFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsDateFilterOpen={setIsDateFilterOpen}
        />
      }
      rowDetails={<EarningDetails selectedEarning={selectedEarning} />}
      actionButtonType="export"
    />
  );
}
