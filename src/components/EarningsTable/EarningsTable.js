import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import API from '../../api/treeTrackerApi';
import useStyles from './EarningsTable.styles';

/**
 * @function
 * @name EarningsTablePagination
 * @description renders table pagination
 *
 * @returns {React.Component} earnings table pagination
 */
const EarningsTablePagination = (props) => {
  const classes = useStyles();
  const { totalCount } = props;

  return (
    <TablePagination
      count={totalCount}
      classes={{
        selectRoot: classes.selectRoot,
        root: classes.earningsTablePagination,
      }}
      rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
      labelRowsPerPage="Rows per page:"
      page={1}
      rowsPerPage={5}
      onChangePage={() => {}}
      onChangeRowsPerPage={() => {}}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
    />
  );
};

/**
 * @function
 * @name EarningsTableTopar
 * @description renders earnings table top bar
 *
 * @returns
 */
function EarningsTableTopar() {
  const classes = useStyles();
  return (
    <Grid container direction="row" alignItems="center" justify="space-between">
      <Grid item className={classes.earningsTableTopBarTitle}>
        <Typography variant="h4">Earnings</Typography>
      </Grid>
    </Grid>
  );
}

/**
 * @Array
 * @name earnings table header columns
 */
const headerColumns = [
  'Grower',
  'Funder',
  'Amount',
  'Payment System',
  'Effective Date',
];

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @returns {React.Component} earnings table
 */
function EarningsTable() {
  const classes = useStyles();
  const [earnings, setEarnings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  async function fetchEarnings() {
    const response = await API.getEarnings();
    setEarnings(response.earnings);
    setTotalCount(response.totalCount);
    console.log('earnings loaded---------------', response);
  }

  useEffect(() => {
    fetchEarnings();
  }, []);

  /**
   * @function
   * @name renderTableHeaderColumns
   * @description renders table header columns
   *
   * @param {Array} columns - table header columns
   * @returns {JSX} table header columns
   */
  const renderTableHeaderColumns = (columns) => (
    <TableRow className={classes.earningsTableHeader}>
      {columns.map((column, i) => (
        <TableCell key={`${i}-${column}`}>
          <Typography variant="h6">
            {column}
            {i === columns.length - 1 && (
              <InfoOutlinedIcon className={classes.infoIcon} />
            )}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );

  /**
   * @function
   * @name renderTableBodyRows
   * @description renders table body rows
   * @param {Array} earnings - earnings to render
   * @returns {JSX} table body rows
   */
  const renderTableBodyRows = (earnings) =>
    earnings.map((earning, i) => (
      <TableRow key={earning.id}>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.name}
        </TableCell>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.funder}
        </TableCell>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.amount}
        </TableCell>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.paymentSystem}
        </TableCell>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.effectivePaymentDate}
        </TableCell>
      </TableRow>
    ));

  return (
    <Grid container direction="column" className={classes.earningsTable}>
      <Grid item>
        <EarningsTableTopar />
      </Grid>
      <Grid item>
        <Table>
          <TableHead>{renderTableHeaderColumns(headerColumns)}</TableHead>
          <TableBody>
            {renderTableBodyRows(earnings)}
            <TableRow>
              <EarningsTablePagination totalCount={totalCount} />
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
