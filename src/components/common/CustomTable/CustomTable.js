import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import TableBody from '@material-ui/core/TableBody';
import GetAppIcon from '@material-ui/icons/GetApp';
import { CSVLink } from 'react-csv';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconFilter from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import useStyles from './CustomTable.styles';

/**
 * @function
 * @name ImportAction
 * @description component that renders the import action button & import csv file logic
 * @param {object} props - properties passed to component
 * @param {function} props.onSelectFile - callback function to be called when file is selected
 *
 * @returns {React.Component}
 * */
function ImportAction(props) {
  const { onSelectFile } = props;

  const handleOnSelectFile = (e) => {
    onSelectFile(e.target.files[0]);
  };

  const classes = useStyles();

  return (
    <Grid item lg={2}>
      <Grid container direction="row" justify="flex-end">
        <input
          accept="multipart/form-data"
          className={classes.uploadFileInput}
          onChange={handleOnSelectFile}
          id="file-upload-button"
          type="file"
        />
        <label htmlFor="file-upload-button">
          <Button variant="text" color="primary" component="span">
            <PublishIcon />
            <Typography variant="h6">UPLOAD</Typography>
          </Button>
        </label>
      </Grid>
    </Grid>
  );
}

ImportAction.propTypes = {
  onSelectFile: PropTypes.func,
};

ImportAction.defaultProps = {
  onSelectFile: () => {},
};

/**
 * @function
 * @name CustomTableHeader
 * @description renders custom table top bar which contains table actions(i.e. filter, export, etc)
 * @param {Object} props - properties passed to component
 * @param {React.Component} props.actionButtonType - determines which action button to render(value can either be 'export' or 'upload')
 * @param {function} props.openDateFilter - opens date filter when called
 * @param {function} props.openMainFilter - opens main filter when called
 * @param {function} props.onSelectFile - callback function to be called when file is selected
 * @param {string} props.headerTitle - title of the table
 * @param {string} props.activeDateRage - string representing the active date range (i.e. 'Oct 1 - Oct 5') in the date filter button
 * @param {Array} props.data - data to be exported
 *
 * @returns {React.Component}
 */
function CustomTableHeader(props) {
  const {
    actionButtonType,
    headerTitle,
    data,
    openDateFilter,
    openMainFilter,
    activeDateRage,
    onSelectFile,
  } = props;
  const classes = useStyles();

  const dataToExport = data.map(
    ({
      id: earnings_id,
      worker_id,
      phone,
      currency,
      amount,
      payment_confirmation_id,
      payment_system,
      paid_at,
    }) => ({
      earnings_id,
      worker_id,
      phone,
      currency,
      amount,
      payment_confirmation_id,
      payment_system,
      paid_at,
    })
  );

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
                    data={dataToExport}
                    filename={`${headerTitle.toLowerCase()}_${new Date().toLocaleDateString()}.csv`}
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
            <ImportAction onSelectFile={onSelectFile} />
          )}

          {/* start Date Range button */}
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button
                className={classes.customTableDateFilterButton}
                onClick={() => openDateFilter()}
              >
                <Grid container direction="row" justify="center">
                  <div>
                    <Typography className={classes.dateFiterButonSmallText}>
                      Date Range
                    </Typography>
                    {activeDateRage ? (
                      <Typography className={classes.dateFiterButonMediumText}>
                        {activeDateRage}
                      </Typography>
                    ) : (
                      <Typography className={classes.dateFiterButonSmallText}>
                        select date range
                      </Typography>
                    )}
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
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button
                onClick={openMainFilter}
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
  // setIsFilterOpen: PropTypes.func.isRequired,
  openDateFilter: PropTypes.func,
  openMainFilter: PropTypes.func,
  onSelectFile: PropTypes.func,
  data: PropTypes.array.isRequired,
  headerTitle: PropTypes.string.isRequired,
  activeDateRage: PropTypes.string.isRequired,
  actionButtonType: PropTypes.string.isRequired,
};

CustomTableHeader.defaultProps = {
  openDateFilter: () => {},
  openMainFilter: () => {},
  onSelectFile: () => {},
};

/**
 * @function
 * @name CustomTable
 * @description displays table containing  rows with data
 *
 * @param {Object} props - properties passed to component
 * @param {Object} props.sortBy - current sort by field and sort order
 * @param {Object} props.selectedRow - selected row
 * @param {Object[]} props.tableMetaData - meta data of the table (carries infomation about table columns etc..)
 * @param {function} props.handleGetData - handler function that triggers get data to be displayed in table
 * @param {function} props.openDateFilter - opens date filter
 * @param {function} props.openMainFilter - opens main filter
 * @param {function} props.setPage - sets current page number
 * @param {function} props.setRowsPerPage - sets number of rows per page number
 * @param {function} props.setSortBy - sets sort by field and sort order
 * @param {function} props.onSelectFile - callback function to be called when file is selected
 * @param {function} props.setSelectedRow - sets selected/clicked row
 * @param {string} props.headerTitle - title of the table header
 * @param {string} props.actionButtonType - determines which action button to render(value can either be 'export' or 'upload')
 * @param {string} props.activeDateRage - string representing the active date range (i.e. 'Oct 1 - Oct 5') in the date filter button
 * @param {boolean} props.isLoading - shows loading spinner when true
 * @param {number} props.page - current page number
 * @param {number} props.rowsPerPage - current number of rows per page
 * @param {number} props.totalCount - total number of rows to be displayed
 * @param {Array} props.rows - rows to be displayed in table
 * @param {React.Component}  props.rowDetails - row  component to display details of a selected row
 * @param {React.Component} props.mainFilterComponent - renders main filter component
 * @param {React.Component} props.dateFilterComponent - renders date filter component
 *
 * @returns {React.Component} custom table
 */
function CustomTable(props) {
  const {
    tableMetaData,
    mainFilterComponent,
    dateFilterComponent,
    headerTitle,
    actionButtonType,
    setSelectedRow,
    selectedRow,
    sortBy,
    rows,
    totalCount,
    rowDetails,
    openDateFilter,
    openMainFilter,
    setPage,
    setRowsPerPage,
    rowsPerPage,
    setSortBy,
    isLoading,
    activeDateRage,
    onSelectFile,
    page,
  } = props;

  // managing custom table  state
  const classes = useStyles();
  const [sortableColumnsObject, setSortableColumnsObject] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenRowDetails = (row) => {
    setSelectedRow(row);
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

  const tablePagination = () => {
    return (
      <TablePagination
        rowsPerPageOptions={[20, 50, 100]}
        component="div"
        count={totalCount || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        aria-label="rows per page"
      />
    );
  };

  return (
    <Grid container direction="column" className={classes.customTable}>
      <CustomTableHeader
        openDateFilter={openDateFilter}
        openMainFilter={openMainFilter}
        data={rows}
        headerTitle={headerTitle}
        activeDateRage={activeDateRage}
        actionButtonType={actionButtonType}
        onSelectFile={onSelectFile}
      />
      {tablePagination()}
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

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Grid item container className={classes.progressContainer}>
                    <CircularProgress />
                  </Grid>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              <>
                {rows.map((row, i) => (
                  <TableRow
                    key={`${i}-${row.id}`}
                    onClick={() => handleOpenRowDetails(row)}
                    className={
                      isRowSelected(row.id) ? classes.selectedRow : null
                    }
                  >
                    {tableMetaData.map((column, j) => (
                      <TableCell key={`${i}-${j}-${column.name}`}>
                        <Typography
                          variant="body1"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {row[column.name]}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body1"
                    className={classes.noDataToDisplay}
                  >
                    No data to display
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {tablePagination()}

      {/* start table main filter */}
      {mainFilterComponent}
      {/* end table main filter */}

      {/* start table date filter */}
      {dateFilterComponent}
      {/* end table date filter */}

      {/* start table row details */}
      {rowDetails}
      {/* end table row details */}
    </Grid>
  );
}

export default CustomTable;

CustomTable.propTypes = {
  handleGetData: PropTypes.func.isRequired,
  openDateFilter: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  onSelectFile: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  sortBy: PropTypes.object.isRequired,
  setSortBy: PropTypes.func.isRequired,
  tableMetaData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      sortable: PropTypes.bool.isRequired,
      showInfoIcon: PropTypes.bool.isRequired,
    })
  ),
  dateFilterComponent: PropTypes.element.isRequired,
  mainFilterComponent: PropTypes.element.isRequired,
  headerTitle: PropTypes.string.isRequired,
  activeDateRage: PropTypes.string.isRequired,
  rowDetails: PropTypes.element,
  actionButtonType: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};

CustomTable.defaultProps = {
  onSelectFile: () => {},
  selectedRow: null,
};
