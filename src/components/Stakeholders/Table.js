import React, { useContext } from 'react';
import StakeholderDetail from './StakeholderDetail';
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
    stakeholders,
    stakeholder,
    columns,
    page,
    rowsPerPage,
    orderBy,
    order,
    setPage,
    setRowsPerPage,
    sort,
    // getStakeholder,
    // getStakeholders,
  } = useContext(StakeholdersContext);

  // useEffect(() => {
  //   // getStakeholders();
  //   getStakeholder('792a4eee-8e18-4750-a56f-91bdec383aa6');
  // }, []);

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
            {stakeholder.map((stakeholder) => (
              <React.Fragment key={stakeholder.id}>
                {/* Main stakeholder */}
                <StakeholderDetail row={stakeholder} columns={columns} />
                {stakeholder.children &&
                  stakeholder.children.map((child) => (
                    <StakeholderDetail
                      key={child.id}
                      row={child}
                      columns={columns}
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
