import React, { useContext, useEffect, useState } from 'react';
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
  // TablePagination,
} from '@material-ui/core';
import StakeholderDetail from './StakeholderDetail/StakeholderDetail';
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
    // count,
    columns,
    isLoading,
    // page,
    // orderBy,
    // order,
    // setOrderBy,
    // setOrder,
    // rowsPerPage,
    // setPage,
    // setRowsPerPage,
  } = useContext(StakeholdersContext);
  const [sortedStakeholders, setSortedStakeholders] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(undefined);

  useEffect(() => {
    setSortedStakeholders(stakeholders);
  }, [stakeholders]);

  // const handleRowsPerPageChange = (e) => {
  //   setRowsPerPage(e.target.value);
  // };

  // const handlePageChange = (e, page) => {
  //   setPage(page);
  // };

  const handleSort = (col, order) => {
    setOrder(order);
    setOrderBy(col);
    const sorted = sort({ col, order: order });
    setSortedStakeholders(sorted);
  };

  const sort = ({ col, order }) => {
    let sorted;
    if (col) {
      sorted = stakeholders.sort((a, b) => {
        let first = a[col];
        let second = b[col];
        if (col === 'name') {
          first = `${a.org_name} ${a.first_name} ${a.lastname}`;
          second = `${b.org_name} ${b.first_name} ${b.lastname}`;
        }
        return (
          (first.trim() > second.trim() ? 1 : -1) * (order === 'desc' ? -1 : 1)
        );
      });
    } else {
      sorted = stakeholders;
    }
    // log.debug(
    //   'sorted',
    //   sorted.map((s) => {
    //     const { org_name, first_name, last_name, email, phone, map } = s;
    //     return { org_name, first_name, last_name, email, phone, map };
    //   })
    // );
    return sorted;
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
                    onClick={() =>
                      handleSort(col.value, order === 'desc' ? 'asc' : 'desc')
                    }
                  >
                    <TableSortLabel
                      active={col.value === orderBy}
                      direction={order}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedStakeholders &&
                sortedStakeholders.map((stakeholder) => (
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
          {/* <TablePagination
            component="div"
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            onChangeRowsPerPage={handleRowsPerPageChange}
            count={count}
            page={page}
            onChangePage={handlePageChange}
          /> */}
        </TableContainer>
      )}
    </>
  );
}

export default StakeholderTable;
