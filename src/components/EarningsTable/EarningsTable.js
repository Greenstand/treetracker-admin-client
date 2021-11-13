import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import GetAppIcon from '@material-ui/icons/GetApp';
import Drawer from '@material-ui/core/Drawer';
import Select from '@material-ui/core/Select';
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
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import API from '../../api/treeTrackerApi';
import useStyles from './EarningsTable.styles';

/**
 * @function
 * @name EarningsTableFilter
 * @description render filter for earnings table
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isFilterOpen - flag that decides where filter should open/close
 * @param {Function} setIsFilterOpen - closes filter when executed
 *
 * @returns {React.Component}
 */
function EarningsTableFilter(props) {
  const { isFilterOpen, setIsFilterOpen } = props;
  const classes = useStyles();

  const closeFilter = () => setIsFilterOpen(false);

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
        <Grid item className={classes.earningsTableFilterHeader}>
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
              onClick={() => closeFilter()}
              className={classes.earningsTableFilterCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end filter header */}

        {/* start filter form */}
        <Grid item>
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
 * @description infomation about column that will display an instance of earning
 */
const earningTableMetaData = [
  { description: 'Grower', name: 'grower' },
  { description: 'Funder', name: 'funder' },
  { description: 'Amount', name: 'amount' },
  { description: 'Payment System', name: 'paymentSystem' },
  { description: 'Effective Date', name: 'effectiveDate' },
  { description: 'Payment Date', name: 'paymentDate' },
];

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log('handleChangeRowsPerPage---', event);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function fetchEarnings() {
    const response = await API.getEarnings();
    setEarnings(response.earnings);
    setTotalCount(response.totalCount);
  }

  useEffect(() => {
    fetchEarnings();
  }, []);

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
                  sortDirection="desc"
                >
                  <TableSortLabel
                    active={true}
                    direction="desc"
                    classes={{ icon: classes.earningsTableHeadSortIcon }}
                    IconComponent={ArrowDropDownIcon}
                  >
                    <Typography variant="h6">
                      {column.description}
                      {i === earningTableMetaData.length - 2 && (
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      )}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {earnings.map((row, i) => (
              <TableRow key={`${i}-${row.id}`}>
                {earningTableMetaData.map((column, j) => (
                  <TableCell key={`${i}-${j}-${column.name}`}>
                    <Typography variant="body1">{row[column.name]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={totalCount}
        classes={{
          selectRoot: classes.selectRoot,
          root: classes.earningsTablePagination,
        }}
        component="div"
        rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
        colSpan={3}
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
    </Grid>
  );
}
