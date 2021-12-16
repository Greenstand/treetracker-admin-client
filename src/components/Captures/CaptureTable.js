import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Table,
  Button,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Typography,
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { getDateTimeStringLocale } from '../../common/locale';
import { getVerificationStatus } from '../../common/utils';
import LinkToWebmap from '../common/LinkToWebmap';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import { tokenizationStates } from '../../common/variables';
import useStyle from './CaptureTable.styles.js';
import ExportCaptures from 'components/ExportCaptures';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';

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
    renderer: (val) => val,
  },
  {
    attr: 'planterIdentifier',
    label: 'Planter Identifier',
    noSort: false,
    renderer: (val) => val,
  },
  {
    attr: 'verificationStatus',
    label: 'Verification Status',
    noSort: true,
    renderer: (val) => val,
  },
  {
    attr: 'speciesId',
    label: 'Species',
    noSort: true,
    renderer: (val) => val,
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
  const [isOpenExport, setOpenExport] = useState(false);
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

  const handleOpenExport = () => {
    setOpenExport(true);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  const createSortHandler = (attr) => {
    return () => {
      const newOrder = orderBy === attr && order === 'asc' ? 'desc' : 'asc';
      const newOrderBy = attr;
      setOrder(newOrder);
      setOrderBy(newOrderBy);
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
    <Grid style={{ height: '100%', overflow: 'auto' }}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="h5" className={classes.title}>
          Captures
        </Typography>
        <Grid className={classes.cornerTable}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<GetApp />}
            className={classes.buttonCsv}
            onClick={handleOpenExport}
          >
            Export Captures
          </Button>
          <ExportCaptures
            isOpen={isOpenExport}
            handleClose={() => setOpenExport(false)}
            columns={columns}
            filter={filter}
            speciesState={speciesState}
          />
          {tablePagination()}
        </Grid>
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
      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={isDetailsPaneOpen}
          capture={capture}
          onClose={closeDrawer}
        />
      </CaptureDetailProvider>
    </Grid>
  );
};

export const formatCell = (capture, speciesState, attr, renderer) => {
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
