import React, { useEffect, useState, useContext, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
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
import IconFilter from '@material-ui/icons/FilterList';
import { getDateTimeStringLocale } from '../common/locale';
import { getVerificationStatus } from '../common/utils';
import LinkToWebmap from './common/LinkToWebmap';
import { CapturesContext } from '../context/CapturesContext';
import CaptureDetailDialog from './CaptureDetailDialog';
import Navbar from './Navbar';
import FilterTop from './FilterTop';
import { tokenizationStates } from '../common/variables';
import api from '../api/treeTrackerApi';

// change 88 to unit spacing,
const useStyle = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingLeft: theme.spacing(16),
    overflowX: 'auto',
  },
  tableGrid: {
    width: '100%',
    overflow: 'hidden',
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
  const capturesContext = useContext(CapturesContext);
  const capturesArray = capturesContext.captures;
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [isFilterShown, setFilterShown] = useState(true);
  const [speciesState, setSpeciesState] = useState({});
  const scrollRef = createRef();
  const classes = useStyle();

  useEffect(() => {
    loadSpecies();
    loadCaptures();
  }, []);

  const loadSpecies = async () => {
    const speciesList = await api.getSpecies(true);
    let species = {};
    speciesList.map((s) => {
      species[s.id] = s.name;
    });
    setSpeciesState(species);
  };

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

  const handleFilterClick = () => {
    setFilterShown(!isFilterShown);
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
    <>
      <Grid container direction="column" className={classes.tableGrid}>
        <Grid item>
          <Navbar
            buttons={[
              <Button
                variant="text"
                color="primary"
                onClick={handleFilterClick}
                startIcon={<IconFilter />}
                key={1}
              >
                Filter
              </Button>,
            ]}
          >
            {isFilterShown && (
              <FilterTop
                isOpen={isFilterShown}
                onSubmit={handleFilterSubmit}
                filter={capturesContext.filter}
                onClick={handleFilterClick}
              />
            )}
          </Navbar>
        </Grid>
        <Grid item>
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
              capture={capturesContext.capture}
              onClose={closeDrawer}
            />
          </div>
        </Grid>
      </Grid>
    </>
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
