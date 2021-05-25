import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Row from './StakeholderDetail';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
} from '@material-ui/core';

const useStyles = makeStyles({
  main: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pl: {
    paddingLeft: '32px',
  },
});

export default function StakeholderTable({ data }) {
  // data keys to show as columns
  const columns = ['name', 'id', 'map', 'email', 'phone', 'website'];
  const classes = useStyles();

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [display, setDisplay] = useState(data.slice(0, rowsPerPage));

  const handleRowsPerPageChange = (e) => {
    const show = e.target.value;
    setDisplay([...data.slice(page * show, (page + 1) * show)]);
    setRowsPerPage(show);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
    setDisplay([...data.slice(page * rowsPerPage, (page + 1) * rowsPerPage)]);
  };

  // sorting
  const [sortCol, setSortCol] = useState();
  const [direction, setDirection] = useState('asc');

  const sort = (col) => {
    const sorted = data.sort((a, b) => {
      if (direction === 'asc') {
        setDirection('desc');
        return a[col] > b[col] ? -1 : 1;
      } else {
        setDirection('asc');
        return a[col] > b[col] ? 1 : -1;
      }
    });
    setSortCol(col);
    setDisplay(sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} onClick={() => sort(col)}>
                  <TableSortLabel
                    active={col === sortCol}
                    direction={direction}
                  >
                    {col}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {display.map((row) => (
              <React.Fragment key={row.id}>
                {/* Main stakeholder */}
                <Row row={row} columns={columns} classes={classes} />
                {row.children.map((child) => (
                  <Row
                    key={child.id}
                    row={child}
                    columns={columns}
                    classes={classes}
                    child
                  />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleRowsPerPageChange}
          count={data.length}
          page={page}
          onChangePage={handlePageChange}
        />
      </TableContainer>
    </>
  );
}
