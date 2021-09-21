import React, { useEffect, useState, useContext, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Typography,
} from '@material-ui/core';

import { getDateTimeStringLocale } from '../common/locale';
import Filter, { FILTER_WIDTH } from './Filter';
import CaptureDetails from './CaptureDetails.js';
import LinkToWebmap from './common/LinkToWebmap';
import { CapturesContext } from '../context/CapturesContext';

// change 88 to unit spacing,
const useStyle = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingLeft: theme.spacing(16),
    overflowX: 'auto',
  },
  tableContainer: {
    width: `calc(100vw  - ${FILTER_WIDTH + theme.spacing(4)}px)`,
    overflowY: 'auto',
    height: '100%',
  },
  tableRow: {
    cursor: 'pointer',
  },
  locationCol: {
    width: '270px',
  },
  table: {
    minHeight: '100vh',
    '&:nth-child(2)': {
      width: 20,
    },
  },
  tableBody: {
    minHeight: '100vh',
  },
  pagination: {
    position: 'sticky',
    bottom: '0px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.15)',
  },
  title: {
    paddingLeft: theme.spacing(4),
  },
}));

const columns = [
  {
    attr: 'id',
    label: 'Capture ID',
  },
  {
    attr: 'planterId',
    label: 'Grower ID',
  },
  {
    attr: 'payment',
    label: 'Payment',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'country',
    label: 'Country',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'speciesId',
    label: 'Species',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'status',
    label: 'Status',
  },
  {
    attr: 'timeCreated',
    label: 'Created',
    renderer: (val) => getDateTimeStringLocale(val),
  },
];

const CaptureTable = () => {
  const capturesContext = useContext(CapturesContext);
  const capturesArray = capturesContext.captures;
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const scrollRef = createRef();
  const classes = useStyle();

  useEffect(() => {
    loadCaptures();
  }, []);

  const loadCaptures = (payload) => {
    capturesContext.getCapturesAsync(payload).then(() => {
      scrollRef.current && scrollRef.current.scrollTo(0, 0);
    });
  };

  const toggleDrawer = (id) => {
    capturesContext.getCaptureAsync(id);
    setIsDetailsPaneOpen(!isDetailsPaneOpen);
  };

  const createToggleDrawerHandler = (id) => {
    return () => {
      toggleDrawer(id);
    };
  };

  const closeDrawer = () => {
    setIsDetailsPaneOpen(false);
  };

  const handleFilterSubmit = (filter) => {
    loadCaptures({
      page: 0,
      filter,
    });
  };

  const handlePageChange = () => {
    loadCaptures({
      page: capturesContext.page + 1,
      rowsPerPage: capturesContext.rowsPerPage,
      filter: capturesContext.filter,
    });
  };

  const handleRowsPerPageChange = (event) => {
    loadCaptures({
      page: 0,
      rowsPerPage: parseInt(event.target.value),
      filter: capturesContext.filter,
    });
  };

  const createSortHandler = (attr) => {
    return () => {
      const order =
        capturesContext.orderBy === attr && capturesContext.order === 'asc'
          ? 'desc'
          : 'asc';
      const orderBy = attr;
      loadCaptures({ order, orderBy });
    };
  };

  const tablePagination = () => {
    return (
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 250, 500]}
        component="div"
        count={capturesContext.captureCount}
        page={capturesContext.page}
        rowsPerPage={capturesContext.rowsPerPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    );
  };

  return (
    <div className={classes.tableContainer} ref={scrollRef}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="h5" className={classes.title}>
          Captures
        </Typography>
        {tablePagination()}
      </Grid>
      <Table data-testid="captures-table">
        <TableHead>
          <TableRow>
            {columns.map(({ attr, label, noSort }) => (
              <TableCell
                key={attr}
                sortDirection={
                  capturesContext.orderBy === attr
                    ? capturesContext.order
                    : false
                }
              >
                <TableSortLabel
                  active={capturesContext.orderBy === attr}
                  direction={
                    capturesContext.orderBy === attr
                      ? capturesContext.order
                      : 'asc'
                  }
                  onClick={createSortHandler(attr)}
                  disabled={noSort}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody data-testid="captures-table-body">
          {capturesArray.map((capture) => (
            <TableRow
              key={capture.id}
              onClick={createToggleDrawerHandler(capture.id)}
              className={classes.tableRow}
            >
              {columns.map(({ attr, renderer }) => (
                <TableCell key={attr}>
                  {formatCell(capture, attr, renderer)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tablePagination()}
      <CaptureDetails
        capture={capturesContext.capture}
        isDetailsPaneOpen={isDetailsPaneOpen}
        closeDrawer={closeDrawer}
      />
      <Filter
        isOpen={true}
        onSubmit={handleFilterSubmit}
        filter={capturesContext.filter}
      />
    </div>
  );
};

const formatCell = (capture, attr, renderer) => {
  if (attr === 'id' || attr === 'planterId') {
    return (
      <LinkToWebmap
        value={capture[attr]}
        type={attr === 'id' ? 'tree' : 'user'}
      />
    );
  } else {
    return renderer ? renderer(capture[attr]) : capture[attr];
  }
};

export default CaptureTable;
