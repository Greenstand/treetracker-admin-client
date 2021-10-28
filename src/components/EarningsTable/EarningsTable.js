import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
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
 * @param {Object} props - component props
 * @returns
 */
function EarningsTableTopar(props) {
  const classes = useStyles();
  return (
    <Grid item className={classes.earningsTableTopBarTitle}>
      <Typography variant="h2">Earnings</Typography>
    </Grid>
  );
}

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @returns {React.Component} earnings table
 */
function EarningsTable() {
  return (
    <Grid container direction="row">
      <EarningsLeftMenu />
      <Grid item>
        <EarningsTableTopar />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Grower</TableCell>
              <TableCell>Funder</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment System</TableCell>
              <TableCell>Effective Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Grower 1</TableCell>
              <TableCell>Funder 1</TableCell>
              <TableCell>$100</TableCell>
              <TableCell>Payment System 1</TableCell>
              <TableCell>01/01/2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Grower 2</TableCell>
              <TableCell>Funder 2</TableCell>
              <TableCell>$100</TableCell>
              <TableCell>Payment System 2</TableCell>
              <TableCell>01/02/2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>Grower 3</TableCell>
              <TableCell>Funder 3</TableCell>
              <TableCell>$100</TableCell>
              <TableCell>Payment System 3</TableCell>
              <TableCell>03/01/2019</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default EarningsTable;
