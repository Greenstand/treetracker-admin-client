import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import GetAppIcon from '@material-ui/icons/GetApp';
import Drawer from '@material-ui/core/Drawer';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableContainer from '@material-ui/core/TableContainer';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import { CSVLink } from 'react-csv';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconFilter from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import earningsAPI from '../../api/earnings';
import useStyles from './EarningsTable.styles';
import { covertDateStringToHumanReadableFormat } from 'utilities';

/**
 * @function
 * @name EarningsTableFilter
 * @description render filter for earnings table
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isFilterOpen - flag that decides wheather filter should open/close
 * @param {Function} setIsFilterOpen - closes filter when executed
 *
 * @returns {React.Component}
 */
function EarningsTableFilter(props) {
  const { isFilterOpen, setIsFilterOpen } = props;
  const classes = useStyles();

  const handleCloseFilter = () => setIsFilterOpen(false);

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isFilterOpen}
    >
      <Grid
        container
        direction="column"
        className={classes.earningsTableFilterForm}
      >
        {/* start filter header */}
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Grid
                container
                direction="row"
                alignContent="flex-end"
                justify="flex-start"
              >
                <Typography variant="h4">Filters</Typography>
                <Avatar className={classes.earningsTableFilterAvatar}>
                  <Typography variant="h5">1</Typography>
                </Avatar>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => handleCloseFilter()}
              className={classes.earningsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end filter header */}

        {/* start filter form */}
        <Grid item>
          <Grid container direction="column" justify="space-between">
            <FormControl
              variant="outlined"
              className={classes.earningsFIlterSelectFormControl}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Funder
              </InputLabel>
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
        {/* end filter form */}
      </Grid>
    </Drawer>
  );
}

EarningsTableFilter.propTypes = {
  isFilterOpen: PropTypes.bool.isRequired,
  setIsFilterOpen: PropTypes.func.isRequired,
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
  const {
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    selectedEarning,
    setSelectedEarning,
  } = props;
  const classes = useStyles();

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setSelectedEarning(null);
  };

  return selectedEarning ? (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={isDetailsDrawerOpen}
    >
      <Grid
        container
        direction="column"
        className={classes.earningsTableFilterForm}
      >
        {/* start earning details header */}
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Grid
                container
                direction="row"
                alignContent="flex-end"
                justify="flex-start"
              >
                <Typography variant="h4">Details</Typography>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={() => handleCloseDetails()}
              className={classes.earningsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end earnings detail header */}

        {/* start earning details contents */}
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
        {/* end earning details contents */}
      </Grid>
    </Drawer>
  ) : (
    ''
  );
}

EarningDetails.propTypes = {
  isDetailsDrawerOpen: PropTypes.bool.isRequired,
  setIsDetailsDrawerOpen: PropTypes.func.isRequired,
  setSelectedEarning: PropTypes.func.isRequired,
  selectedEarning: PropTypes.object.isRequired,
};

/**
 * @function
 * @name EarningsTableTopBar
 * @description renders earnings table top bar which contains table actions(i.e. filter, export, etc)
 * @param {object} props - properties passed to component
 * @param {array} props.data - earnings  to be exported
 * @param {string} props.setIsFilterOpen - sets filter open/closed
 *
 * @returns {React.Component}
 */
function EarningsTableTopBar(props) {
  const { setIsFilterOpen, data } = props;
  const classes = useStyles();
  const openFilter = () => setIsFilterOpen(true);
  return (
    <Grid container className={classes.earningsTableTopBar}>
      <Grid item xs={4}>
        <Typography className={classes.earningsTableTopTitle} variant="h4">
          Earnings
        </Typography>
      </Grid>

      {/*  start earning table actions */}
      <Grid item xs={8}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          {/* start EXPORT button */}
          <Grid item lg={2}>
            <Grid container direction="row" justify="flex-end">
              <Button color="primary" variant="text">
                <CSVLink
                  data={data}
                  filename={'earnings.csv'}
                  className={classes.csvLink}
                  target="_blank"
                >
                  <GetAppIcon />
                  <Typography variant="h6">EXPORT</Typography>
                </CSVLink>
              </Button>
            </Grid>
          </Grid>
          {/*  end EXPORT button */}

          {/* start Date Range button */}
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button className={classes.earningsTableDateFilterButton}>
                <Grid container direction="row" justify="center">
                  <div>
                    <Typography className={classes.dateFiterButonSmallText}>
                      Date Range
                    </Typography>
                    <Typography className={classes.dateFiterButonMediumText}>
                      Oct 1 - Oct 5
                    </Typography>
                  </div>
                  <ArrowDropDownIcon
                    className={classes.arrowDropDownIcon}
                    fontSize="large"
                  />
                </Grid>
              </Button>
            </Grid>
          </Grid>
          {/* end Date Range button */}

          {/* start Filter button */}
          <Grid item lg={3} xs={4}>
            <Grid container direction="row" justify="flex-end">
              <Button
                onClick={openFilter}
                className={classes.filterButton}
                startIcon={<IconFilter className={classes.iconFilter} />}
              >
                <Typography className={classes.filterButtonText}>
                  Filter
                </Typography>
                <Avatar className={classes.filterAvatar}>3</Avatar>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* end earnings table actions */}
    </Grid>
  );
}
EarningsTableTopBar.propTypes = {
  setIsFilterOpen: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

/**
 * @constant
 * @name earningTableMetaData
 * @description infomation about column that will display an instance of Earning
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
 * transform earnings such that are well formated compatible with earnigs table meta data
 * @param {object} earnings
 * @returns {Array}
 */
const prepareEarnings = (earnings) =>
  earnings.map((earning) => {
    const {
      id,
      grower,
      currency,
      funder,
      amount,
      payment_system,
      paid_at,
      calculated_at,
    } = earning;
    return {
      id,
      grower,
      funder,
      amount: `${currency} ${amount}`,
      payment_system,
      paid_at,
      calculated_at: covertDateStringToHumanReadableFormat(calculated_at),
    };
  });

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @returns {React.Component} earnings table
 */
export default function EarningsTable() {
  const classes = useStyles();
  const [earnings, setEarnings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [sortableColumnsObject, setSortableColumnsObject] = useState({});
  const [sortBy, setSortBy] = useState(null);

  const handleChangePage = (event, newPage) => {
    setEarnings([]);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setEarnings([]);
    setPage(0);
  };

  async function fetchEarnings(limit, currentPage, sorByInfo) {
    const offset = limit * currentPage;
    const response = await earningsAPI.getEarnings(limit, offset, sorByInfo);
    const preparedEarnings = prepareEarnings(response.earnings);
    setEarnings(preparedEarnings);
    setTotalCount(response.totalCount);
  }

  const handleOpenEarningDetails = (earning) => {
    setSelectedEarning(earning);
    setIsDetailsDrawerOpen(true);
  };

  const handleSortableColumns = (column) => {
    const sortableColumns = {
      ...sortableColumnsObject,
      [column.name]: sortableColumnsObject[column.name]
        ? sortableColumnsObject[column.name] === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc',
    };
    setEarnings([]);
    setSortableColumnsObject(sortableColumns);
    setSortBy({ field: column.name, order: sortableColumns[column.name] });
  };

  const isRowSelected = (id) => id === selectedEarning?.id;

  useEffect(() => {
    fetchEarnings(rowsPerPage, page, sortBy);
  }, [rowsPerPage, page, sortBy]);

  return (
    <Grid container direction="column" className={classes.earningsTable}>
      <EarningsTableTopBar setIsFilterOpen={setIsFilterOpen} data={earnings} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={classes.earningsTableHeader}>
              {earningTableMetaData.map((column, i) => (
                <TableCell
                  key={`${i}-${column.description}`}
                  sortDirection={
                    sortableColumnsObject[column.name] || column.sortDirection
                  }
                >
                  {column?.sortable ? (
                    <TableSortLabel
                      active={sortBy?.field === column.name}
                      onClick={() => handleSortableColumns(column)}
                      direction={sortableColumnsObject[column.name]}
                      classes={{ icon: classes.earningsTableHeadSortIcon }}
                      IconComponent={ArrowDropDownIcon}
                    >
                      <Typography variant="h6">
                        {column.description}
                        {column?.showInfoIcon && (
                          <InfoOutlinedIcon className={classes.infoIcon} />
                        )}
                      </Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography variant="h6">
                      {column.description}
                      {column?.showInfoIcon && (
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      )}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {earnings.length > 0 ? (
            <TableBody>
              {earnings.map((earning, i) => (
                <TableRow
                  key={`${i}-${earning.id}`}
                  onClick={() => handleOpenEarningDetails(earning)}
                  className={
                    isRowSelected(earning.id)
                      ? classes.selectedEarningsTableRow
                      : ''
                  }
                >
                  {earningTableMetaData.map((column, j) => (
                    <TableCell key={`${i}-${j}-${column.name}`}>
                      <Typography variant="body1">
                        {earning[column.name]}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Grid item container className={classes.progressContainer}>
              <CircularProgress />
            </Grid>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        count={totalCount}
        classes={{
          selectRoot: classes.selectRoot,
          root: classes.earningsTablePagination,
        }}
        component="div"
        rowsPerPageOptions={[20, 50, 100, { label: 'All', value: -1 }]}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
      />

      <EarningsTableFilter
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <EarningDetails
        isDetailsDrawerOpen={isDetailsDrawerOpen}
        setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
        selectedEarning={selectedEarning}
        setSelectedEarning={setSelectedEarning}
      />
    </Grid>
  );
}
