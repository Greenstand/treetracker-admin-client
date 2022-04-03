import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
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
import StakeholderDetail from './StakeholderDetail';
import { StakeholdersContext } from '../../context/StakeholdersContext';

const useStyles = makeStyles({
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '60vh',
    width: '100vw',
  },
});

function StakeholderTable() {
  const classes = useStyles();
  const {
    stakeholders,
    count,
    columns,
    isLoading,
    page,
    orderBy,
    order,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    sort,
  } = useContext(StakeholdersContext);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  const handleSort = (col, order) => {
    console.log('sort col', { col, order });
    sort({ col, order });
  };

  return (
    <>
      {isLoading ? (
        <div className={classes.placeholder}>
          <CircularProgress id="loading" />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.value}
                    onClick={() => handleSort(col.value, !order)}
                  >
                    <TableSortLabel
                      active={col.value === orderBy}
                      direction={order ? 'asc' : 'desc'}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {stakeholders &&
                stakeholders.map((stakeholder) => (
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
            rowsPerPageOptions={[5, 10, 15]}
            onChangeRowsPerPage={handleRowsPerPageChange}
            count={count}
            page={page}
            onChangePage={handlePageChange}
          />
        </TableContainer>
      )}
    </>
  );
}

export default StakeholderTable;
