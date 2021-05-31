import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Row from './EditDialog';
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

function StakeholderTable({ state, dispatch }) {
  const { data, display, columns, rowsPerPage, page, sortBy, sortAsc } = state;
  const { getData, changePage, changeRowsPerPage, sort } = dispatch;

  useEffect(() => {
    getData();
  }, []);

  const handleRowsPerPageChange = (e) => {
    changeRowsPerPage(e.target.value);
  };

  const handlePageChange = (e, page) => {
    changePage(page);
  };

  const handleSort = (col) => {
    sort(col);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.value}
                  onClick={() => handleSort(col.value)}
                >
                  <TableSortLabel
                    active={col.value === sortBy}
                    direction={sortAsc ? 'asc' : 'desc'}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {display.map((row) => (
              <React.Fragment key={row.id}>
                {/* Main stakeholder */}
                <Row row={row} columns={columns} />
                {row.children.map((child) => (
                  <Row key={child.id} row={child} columns={columns} child />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[1, 2, 5]}
          onChangeRowsPerPage={handleRowsPerPageChange}
          count={data.length}
          page={page}
          onChangePage={handlePageChange}
        />
      </TableContainer>
    </>
  );
}

export default connect(
  //state
  (state) => ({
    state: state.stakeholders,
  }),
  //dispatch
  (dispatch) => ({
    dispatch: dispatch.stakeholders,
  }),
)(StakeholderTable);
