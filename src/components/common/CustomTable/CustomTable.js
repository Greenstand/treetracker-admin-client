import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import TableBody from '@material-ui/core/TableBody';
import Drawer from '@material-ui/core/Drawer';
import GetAppIcon from '@material-ui/icons/GetApp';
import { CSVLink } from 'react-csv';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconFilter from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import useStyles from './CustomTable.styles';
import { covertDateStringToHumanReadableFormat } from 'utilities';

/**
 * @function
 * @name CustomTableHeader
 * @description renders custom table top bar which contains table actions(i.e. filter, export, etc)
 * @param {object} props - properties passed to component
 * @param {React.Component} props.actionButtonType - determines which action button to render(value can either be 'export' or 'upload')
 * @param {string} props.setIsFilterOpen - sets filter open/closed
 * @param {string} props.headerTitle - title of the table
 * @param {Array} props.data - data to be exported
 *
 * @returns {React.Component}
 */
function CustomTableHeader(props) {
  const { setIsFilterOpen, actionButtonType, headerTitle, data } = props;
  const classes = useStyles();
  const openFilter = () => setIsFilterOpen(true);
  return (
    <Grid container className={classes.customTableTopBar}>
      <Grid item xs={4}>
        <Typography className={classes.customTableTopTitle} variant="h4">
          {headerTitle}
        </Typography>
      </Grid>

      {/*  start custom table actions */}
      <Grid item xs={8}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          {/*  show export button if actionButtonType is 'export' */}
          {actionButtonType === 'export' && (
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
          )}

          {actionButtonType === 'upload' && (
            <Grid item lg={2}>
              <Grid container direction="row" justify="flex-end">
                <Button color="primary" variant="text">
                  <PublishIcon />
                  <Typography variant="h6">UPLOAD</Typography>
                </Button>
              </Grid>
            </Grid>
          )}

          {/* start Date Range button */}
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button className={classes.customTableDateFilterButton}>
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
      {/* end custom table actions */}
    </Grid>
  );
}
CustomTableHeader.propTypes = {
  setIsFilterOpen: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  headerTitle: PropTypes.string.isRequired,
  actionButtonType: PropTypes.string.isRequired,
};

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
      funder,
      amount: `${currency} ${amount}`,
      payment_system,
      paid_at,
      calculated_at: covertDateStringToHumanReadableFormat(calculated_at),
    };
  });

/**
 * @function
 * @name CustomTable
 * @description displays table containing  rows with data
 * @param {object} props - properties passed to component
 * @param {function} props.handleGetData - handler function that triggers get data to be displayed in table
 * @param {Array} props.data - data to be displayed in table
 * @param {React.Component} props.filter - renders table filter form
 * @param {string} props.headerTitle - title of the table header
 * @param {string} props.actionButtonType - determines type of action button to be displayed(its value is either upload or export only!)
 * @returns {React.Component} custom table
 */
function CustomTable(props) {
  const {
    handleGetData,
    tableMetaData,
    filter,
    headerTitle,
    actionButtonType,
    setSelected,
    data,
    totalCount,
    rowDetails,
  } = props;

  // managing custom table  state
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortableColumnsObject, setSortableColumnsObject] = useState({});
  const [sortBy, setSortBy] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function fetchData(limit, currentPage, sorByInfo) {
    const offset = limit * currentPage;
    setRows([]);
    handleGetData(limit, offset, sorByInfo);
  }

  const handleOpenRowDetails = (row) => {
    setSelectedRow(row);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDrawerOpen(false);
    setSelectedRow(null);
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
    setSortableColumnsObject(sortableColumns);
    setSortBy({ field: column.name, order: sortableColumns[column.name] });
  };

  const isRowSelected = (id) => id === selectedRow?.id;

  useEffect(() => {
    const preparedRows = prepareRows(data);
    setRows(preparedRows);
  }, [data]);

  useEffect(() => {
    fetchData(rowsPerPage, page, sortBy);
  }, [rowsPerPage, page, sortBy]);

  return (
    <Grid container direction="column" className={classes.customTable}>
      <CustomTableHeader
        setIsFilterOpen={setIsFilterOpen}
        data={rows}
        headerTitle={headerTitle}
        actionButtonType={actionButtonType}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={classes.customTableHeader}>
              {tableMetaData.map((column, i) => (
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
                      classes={{ icon: classes.customTableHeadSortIcon }}
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

          {rows.length > 0 ? (
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={`${i}-${row.id}`}
                  onClick={() => handleOpenRowDetails(row)}
                  className={
                    isRowSelected(row.id) ? classes.selectedcustomTableRow : ''
                  }
                >
                  {tableMetaData.map((column, j) => (
                    <TableCell key={`${i}-${j}-${column.name}`}>
                      <Typography variant="body1">
                        {row[column.name]}
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
          root: classes.customTablePagination,
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

      {/* start table filter */}
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
                  <Avatar className={classes.customTableFilterAvatar}>
                    <Typography variant="h5">1</Typography>
                  </Avatar>
                </Grid>
              </Grid>
              <CloseIcon
                onClick={() => setIsFilterOpen(false)}
                className={classes.customTableFilterCloseIcon}
              />
            </Grid>
          </Grid>
          {/* end filter header */}
          {filter}
        </Grid>
      </Drawer>
      {/* end table filter */}

      {/* start table row details */}
      <Drawer
        anchor="right"
        BackdropProps={{ invisible: true }}
        open={isDetailsDrawerOpen}
      >
        <Grid
          container
          direction="column"
          className={classes.customTableFilterForm}
        >
          {/* start  details header */}
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
                className={classes.customTableFilterCloseIcon}
              />
            </Grid>
          </Grid>
          {/* end detail header */}

          {rowDetails}
        </Grid>
      </Drawer>
      {/* end table row details */}
    </Grid>
  );
}

export default CustomTable;

CustomTable.propTypes = {
  handleGetData: PropTypes.func.isRequired,
  tableMetaData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      sortable: PropTypes.bool.isRequired,
      showInfoIcon: PropTypes.bool.isRequired,
    }),
  ),
  filter: PropTypes.element.isRequired,
  headerTitle: PropTypes.string.isRequired,
  actionButtonType: PropTypes.element.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};
