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
} from '@material-ui/core';
import StakeholderDetail from './StakeholderDetail/StakeholderDetail';
import { StakeholdersContext } from '../../context/StakeholdersContext';
import log from 'loglevel';

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
  const { stakeholders, columns, isLoading } = useContext(StakeholdersContext);
  const [sortedStakeholders, setSortedStakeholders] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(undefined);

  useEffect(() => {
    setSortedStakeholders(stakeholders);
  }, [stakeholders]);

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
        log.debug(`sort: ${col} ${first} ${second}`);
        // prepare to sort if it's any kind of name
        if (col === 'name') {
          first = `${a.org_name || ''} ${a.first_name || ''} ${
            a.last_name || ''
          }`.trim();
          second = `${b.org_name || ''} ${b.first_name || ''} ${
            b.last_name || ''
          }`.trim();
        }
        const orderVal = order === 'desc' ? -1 : 1;
        let sortVal = 0;
        if (first && second) {
          sortVal = first.localeCompare(second);
        } else {
          // if one of them is null, sort it to the end
          sortVal = (first || '') > (second || '') ? 1 : -1;
        }
        return sortVal * orderVal;
      });
    } else {
      sorted = stakeholders;
    }
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
                          parentId={stakeholder.id}
                          child
                        />
                      ))}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default StakeholderTable;
