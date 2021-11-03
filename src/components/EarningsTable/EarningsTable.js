import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import useStyles from './EarningsTable.styles';
import Menu from '../common/Menu';

/**
 * @function
 * @name EarningsTablePagination
 * @description renders table pagination
 *
 * @returns {React.Component} earnings table pagination
 */
const EarningsTablePagination = () => {
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
 * @returns {React.Component} left menu
 */
function EarningsLeftMenu() {
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
    <Grid item>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item className={classes.earningsTableTopBarTitle}>
          <Typography variant="h3">Earnings</Typography>
        </Grid>
        <Grid item className={classes.topBarActions}>
          <Grid container direction="row" justify="space-around">
            <Grid item>
              <Typography variant="h6" className={classes.actionButton}>
                <GetAppIcon className={classes.actionButtonIcon} />
                EXPORT
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.actionButton}>
                <PublishIcon className={classes.actionButtonIcon} />
                IMPORT
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
const earnings = [
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
   * @param {Array} earnings - earnings to render
   * @returns {JSX} table body rows
   */
  const renderTableBodyRows = (earnings) =>
    earnings.map((earning, i) => (
      <TableRow key={earning.id}>
        <TableCell
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.id}
        </TableCell>
        <TableCell
          align="right"
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.name}
        </TableCell>
        <TableCell
          align="right"
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.funder}
        </TableCell>
        <TableCell
          align="right"
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.amount}
        </TableCell>
        <TableCell
          align="right"
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.paymentSystem}
        </TableCell>
        <TableCell
          align="right"
          classes={i === earnings.length - 1 ? { root: classes.root } : {}}
        >
          {earning.effectivePaymentDate}
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
          <TableBody>{renderTableBodyRows(earnings)}</TableBody>
          <TableFooter>
            <EarningsTablePagination />
          </TableFooter>
        </Table>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
