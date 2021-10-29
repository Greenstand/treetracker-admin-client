import React, { useEffect, useState, useContext, createRef } from 'react';
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
import { getDateTimeStringLocale } from '../../common/locale';
import { getVerificationStatus } from '../../common/utils';
import LinkToWebmap from '../common/LinkToWebmap';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import { tokenizationStates } from '../../common/variables';
import useStyle from './CaptureTable.styles.js';

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
    attr: 'deviceIdentifier',
    label: 'Device Identifier',
    noSort: false,
  },
  {
    attr: 'planterIdentifier',
    label: 'Planter Identifier',
    noSort: false,
  },
  {
    attr: 'verificationStatus',
    label: 'Verification Status',
    noSort: true,
  },
  {
    attr: 'speciesId',
    label: 'Species',
    noSort: true,
  },
  {
    attr: 'tokenId',
    label: 'Token Status',
    renderer: (val) =>
      val ? tokenizationStates.TOKENIZED : tokenizationStates.NOT_TOKENIZED,
  },
  {
    attr: 'timeCreated',
    label: 'Created',
    renderer: (val) => getDateTimeStringLocale(val),
  },
];

const CaptureTable = () => {
  const {
    filter,
    rowsPerPage,
    page,
    order,
    orderBy,
    captures,
    capture,
    captureCount,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    getCaptureAsync,
  } = useContext(CapturesContext);
  const speciesContext = useContext(SpeciesContext);
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [speciesState, setSpeciesState] = useState({});
  const scrollRef = createRef();
  const classes = useStyle();

  useEffect(() => {
    formatSpeciesData();
  }, [filter]);

  const formatSpeciesData = async () => {
    let species = {};
    speciesContext.speciesList.map((s) => {
      species[s.id] = s.name;
    });
    setSpeciesState(species);
  };

  const toggleDrawer = (id) => {
    getCaptureAsync(id);
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

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  const createSortHandler = (attr) => {
    return () => {
      const order = orderBy === attr && order === 'asc' ? 'desc' : 'asc';
      const orderBy = attr;
      setOrder(order);
      setOrderBy(orderBy);
    };
  };

  const tablePagination = () => {
    return (
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 250, 500]}
        component="div"
        count={captureCount || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    );
  };

  return (
    <Grid item container style={{ height: '100%', overflow: 'auto' }}>
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
                  sortDirection={orderBy === attr ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === attr}
                    direction={orderBy === attr ? order : 'asc'}
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
            {captures &&
              captures.map((capture) => (
                <TableRow
                  key={capture.id}
                  onClick={createToggleDrawerHandler(capture.id)}
                  className={classes.tableRow}
                >
                  {columns.map(({ attr, renderer }) => (
                    <TableCell key={attr}>
                      {formatCell(capture, speciesState, attr, renderer)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {tablePagination()}
        <CaptureDetailDialog
          open={isDetailsPaneOpen}
          capture={capture}
          onClose={closeDrawer}
        />
      </div>
    </Grid>
  );
};

const formatCell = (capture, speciesState, attr, renderer) => {
  if (attr === 'id' || attr === 'planterId') {
    return (
      <LinkToWebmap
        value={capture[attr]}
        type={attr === 'id' ? 'tree' : 'user'}
      />
    );
  } else if (attr === 'speciesId') {
    return capture[attr] === null ? '--' : speciesState[capture[attr]];
  } else if (attr === 'verificationStatus') {
    return capture['active'] === null || capture['approved'] === null
      ? '--'
      : getVerificationStatus(capture['active'], capture['approved']);
  } else {
    return renderer ? renderer(capture[attr]) : capture[attr];
  }
};

export default CaptureTable;
