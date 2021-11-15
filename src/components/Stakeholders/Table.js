import React, { useEffect, useContext } from 'react';
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
import { StakeholdersContext } from '../../context/StakeholdersContext';

function StakeholderTable() {
  const {
    stakeholder,
    stakeholders,
    columns,
    page,
    rowsPerPage,
    filter,
    orderBy,
    order,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setFilter,
    setIsLoading,
    setDisplay,
    sort,
    updateFilters,
    getStakeholder,
    getStakeholders,
    createStakeholder,
    linkStakeholder,
    unlinkStakeholder,
  } = useContext(StakeholdersContext);

  useEffect(() => {
    getStakeholders();
  }, []);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
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
                    active={col.value === order}
                    direction={orderBy ? 'asc' : 'desc'}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stakeholders.map((row) => (
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
          count={stakeholders.length}
          page={page}
          onChangePage={handlePageChange}
        />
      </TableContainer>
    </>
  );
}

export default StakeholderTable;
