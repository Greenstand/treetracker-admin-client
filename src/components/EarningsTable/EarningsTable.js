import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import API from '../../api/treeTrackerApi';
import useStyles from './EarningsTable.styles';

/**
 * @function
 * @name EarningsTableTopar
 * @description renders earnings table top bar which contains table actions(i.e. filter, export, etc)
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
 * @function
 * @name EarningsTableHead
 * @description renders earnings table head columns dynamically
 * @param {object} props
 * @param {string} props.columns
 *
 * @returns {React.Component} earnings table head columns
 */
const EarningsTableHead = ({ columns }) => {
  const classes = useStyles();

  return (
    <TableHead>
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
    </TableHead>
  );
};

/**
 * @function
 * @name EarningsTablePagination
 * @description renders table pagination
 *
 * @param {object} props
 * @param {string} props.total - total earnings
 *
 * @returns {React.Component} earnings table pagination
 */
const EarningsTablePagination = ({ total }) => {
  const classes = useStyles();

  return (
    <TablePagination
      count={total}
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
 * @name EarningsTableBody
 * @description renders earnings table body rows dynamically
 * @param {object} props
 * @param {object} props.data
 * @param {string} props.columns
 * @param {string} props.total
 *
 * @returns {React.Component} earnings table body rows
 */
const EarningsTableBody = ({ data, columns, total }) => {
  return (
    <TableBody>
      {data.map((row, i) => (
        <TableRow key={`${i}-${row.id}`}>
          {columns.map((column, j) => (
            <TableCell key={`${i}-${j}-${column}`}>
              <Typography variant="body1">{row[column]}</Typography>
            </TableCell>
          ))}
        </TableRow>
      ))}
      <TableRow>
        <EarningsTablePagination total={total} />
      </TableRow>
    </TableBody>
  );
};

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

  const headerColumns = [
    'Grower',
    'Funder',
    'Amount',
    'Payment System',
    'Effective Date',
  ];

  const bodyColumns = [
    'grower',
    'funder',
    'amount',
    'paymentSystem',
    'effectiveDate',
  ];

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
      <Grid item>
        <EarningsTableTopar />
      </Grid>
      <Grid item>
        <Table>
          <EarningsTableHead columns={headerColumns} />
          <EarningsTableBody
            data={earnings}
            columns={bodyColumns}
            total={totalCount}
          />
        </Table>
      </Grid>
    </Grid>
  );
}
