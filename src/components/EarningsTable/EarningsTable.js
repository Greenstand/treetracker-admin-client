import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import useStyles from './EarningsTable.styles';
import Menu from '../common/Menu';

/**
 * @function
 * @name GrowersTablePagination
 * @description renders table pagination
 *
 * @returns {React.Component} growers table pagination
 */
const GrowersTablePagination = () => {
  const classes = useStyles();

  return (
    <TablePagination
      count={10}
      classes={{ selectRoot: classes.selectRoot, root: classes.root }}
      rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
      labelRowsPerPage="Rows per page"
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
 * @name EarningsLeftMenu
 * @description renders left menu
 *
 * @param {Object} props - component props
 * @param {Object} props.classes - component css classes
 * @returns {React.Component} left menu
 */
function EarningsLeftMenu(props) {
  const classes = useStyles();
  return (
    <Grid item xs={2}>
      <Paper elevation={3} className={classes.menu}>
        <Menu variant="plain" />
      </Paper>
    </Grid>
  );
}

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
    <Grid item className={classes.earningsTableTopBarTitle}>
      <Typography variant="h3">Earnings</Typography>
    </Grid>
  );
}

/**
 * @Array
 * @name earnings table header columns
 */
const headerColumns = [
  'Id',
  'Grower',
  'Funder',
  'Amount',
  'Payment System',
  'Effective Payment Date',
];
const growers = [
  {
    id: 1,
    name: 'Grower 1',
    funder: 'Funder 1',
    amount: '$100',
    paymentSystem: 'Payment System 1',
    effectivePaymentDate: '01/01/2019',
  },
  {
    id: 2,
    name: 'Grower 2',
    funder: 'Funder 2',
    amount: '$100',
    paymentSystem: 'Payment System 2',
    effectivePaymentDate: '01/02/2019',
  },
  {
    id: 3,
    name: 'Grower 3',
    funder: 'Funder 3',
    amount: '$100',
    paymentSystem: 'Payment System 3',
    effectivePaymentDate: '03/01/2019',
  },
];

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @returns {React.Component} earnings table
 */
function EarningsTable() {
  const classes = useStyles();

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
        <TableCell key={`${i}-${column}`} align={i === 0 ? '' : 'right'}>
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
   * @param {Array} growers - growers to render
   * @returns {JSX} table body rows
   */
  const renderTableBodyRows = (growers) =>
    growers.map((grower, i) => (
      <TableRow key={grower.id}>
        <TableCell
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.id}
        </TableCell>
        <TableCell
          align="right"
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.name}
        </TableCell>
        <TableCell
          align="right"
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.funder}
        </TableCell>
        <TableCell
          align="right"
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.amount}
        </TableCell>
        <TableCell
          align="right"
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.paymentSystem}
        </TableCell>
        <TableCell
          align="right"
          classes={i === growers.length - 1 ? { root: classes.root } : {}}
        >
          {grower.effectivePaymentDate}
        </TableCell>
      </TableRow>
    ));

  return (
    <Grid container direction="row">
      <EarningsLeftMenu />
      <Grid item className={classes.earningsTableRightContents}>
        <EarningsTableTopar />
        <Table>
          <TableHead>{renderTableHeaderColumns(headerColumns)}</TableHead>
          <TableBody>{renderTableBodyRows(growers)}</TableBody>
          <TableFooter>
            <GrowersTablePagination />
          </TableFooter>
        </Table>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
