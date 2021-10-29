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
const headerColumns = ['Id', 'Grower', 'Funder', 'Amount', 'Payment System'];

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
          <Typography variant="h6">{column}</Typography>
        </TableCell>
      ))}
      <TableCell>
        <Typography variant="h6" align="right">
          Effective Payment Date{' '}
          <InfoOutlinedIcon className={classes.infoIcon} />
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Grid container direction="row">
      <EarningsLeftMenu />
      <Grid item className={classes.earningsTableRightContents}>
        <EarningsTableTopar />
        <Table>
          <TableHead>{renderTableHeaderColumns(headerColumns)}</TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell align="right">Grower 1</TableCell>
              <TableCell align="right">Funder 1</TableCell>
              <TableCell align="right">$100</TableCell>
              <TableCell align="right">Payment System 1</TableCell>
              <TableCell align="right">01/01/2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell align="right">Grower 2</TableCell>
              <TableCell align="right">Funder 2</TableCell>
              <TableCell align="right">$100</TableCell>
              <TableCell align="right">Payment System 2</TableCell>
              <TableCell align="right">01/02/2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell align="right">Grower 3</TableCell>
              <TableCell align="right">Funder 3</TableCell>
              <TableCell align="right">$100</TableCell>
              <TableCell align="right">Payment System 3</TableCell>
              <TableCell align="right">03/01/2019</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TablePagination
              count={10}
              className={classes.root}
              rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
              page={1}
              rowsPerPage={5}
              onChangePage={() => {}}
              onChangeRowsPerPage={() => {}}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          </TableFooter>
        </Table>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
