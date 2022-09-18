import React, { useEffect, useState, useContext } from 'react';
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
  Tooltip,
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { getDateTimeStringLocale } from '../../common/locale';
import { getVerificationStatus } from '../../common/utils';
import LinkToWebmap from '../common/LinkToWebmap';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import useStyle from './CaptureTable.styles.js';
import ExportCaptures from 'components/ExportCaptures';
import {
  CaptureDetailProvider,
  CaptureType,
} from '../../context/CaptureDetailContext';
import { TagsContext } from 'context/TagsContext';
import api from '../../api/treeTrackerApi';
import CircularProgress from '@material-ui/core/CircularProgress';
import CaptureTooltip from './CaptureTooltip';
// import log from 'loglevel';

const columns = [
  {
    attr: 'id',
    label: 'Capture ID',
  },
  {
    attr: 'grower_account_id',
    label: 'Grower Acct. ID',
  },
  {
    attr: 'device_identifier',
    label: 'Device Identifier',
    noSort: false,
    renderer: (val) => val,
  },
  {
    attr: 'wallet',
    label: 'Grower Wallet',
    noSort: false,
    renderer: (val) => val,
  },
  {
    attr: 'status',
    label: 'Verification Status',
    noSort: true,
    renderer: (val) => val,
  },
  {
    attr: 'species_id',
    label: 'Species',
    noSort: true,
    renderer: (val) => val,
  },

  {
    attr: 'token_id',
    label: 'Token ID',
    renderer: (val) => val,
  },
  {
    attr: 'tags',
    label: 'Capture Tags',
    noSort: true,
  },
  {
    attr: 'note',
    label: 'Notes',
    noSort: true,
    renderer: (val) => val,
  },
  {
    attr: 'created_at',
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
    isLoading,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setCapture,
    getCapture,
  } = useContext(CapturesContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [speciesLookup, setSpeciesLookup] = useState({});
  const [tagLookup, setTagLookup] = useState({});
  const [captureTagLookup, setCaptureTagLookup] = useState({});
  const [isOpenExport, setOpenExport] = useState(false);
  const [disableHoverListener, setDisableHoverListener] = useState(false);
  const classes = useStyle();

  useEffect(() => {
    populateSpeciesLookup();
  }, [speciesContext.speciesList]);

  useEffect(() => {
    populateTagLookup();
  }, [tagsContext.tagList]);

  const getCaptureTags = async () => {
    // Don't do anything if there are no captures
    if (!captures?.length) {
      return;
    }
    // Get the capture tags for all of the displayed captures
    const captureTags = await api.getCaptureTags(captures.map((c) => c.id));
    // log.debug('getCaptureTags', captureTags);
    // log.debug('tagLookup', tagLookup);

    // Populate a lookup for quick access when rendering the table
    let lookup = {};
    captureTags.forEach((captureTag) => {
      if (!lookup[captureTag.treeId]) {
        lookup[captureTag.treeId] = [];
      }
      lookup[captureTag.treeId].push(tagLookup[captureTag.tagId]);
    });

    // log.debug('lookup', lookup);
    setCaptureTagLookup(lookup);
  };

  useEffect(() => {
    getCaptureTags();
  }, [captures, tagLookup]);

  const populateSpeciesLookup = async () => {
    let species = {};
    speciesContext.speciesList.forEach((s) => {
      species[s.id] = s.name;
    });
    setSpeciesLookup(species);
  };

  const populateTagLookup = async () => {
    let tags = {};
    tagsContext.tagList.forEach((t) => {
      tags[t.id] = t.name;
    });
    // log.debug('tags', tags);
    setTagLookup(tags);
  };

  const toggleDrawer = (id) => {
    // log.debug('toggleDrawer', id);
    getCapture(id);
    setIsDetailsPaneOpen(!isDetailsPaneOpen);
  };

  const createToggleDrawerHandler = (id) => {
    return () => {
      toggleDrawer(id);
    };
  };

  const closeDrawer = () => {
    setIsDetailsPaneOpen(false);
    setDisableHoverListener(false);
    setCapture({});
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

  const enableTooltips = process.env.REACT_APP_ENABLE_TOOLTIPS === 'true';

  return (
    <Grid style={{ height: '100%', overflow: 'auto', textAlign: 'center' }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
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
            speciesLookup={speciesLookup}
            captureTagLookup={captureTagLookup}
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
          {isLoading && !captures?.length ? (
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.loadingIndicator}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {captures &&
                captures.map((capture) => (
                  <Tooltip
                    key={capture.id}
                    placement="top"
                    arrow={true}
                    interactive={!disableHoverListener}
                    enterDelay={500}
                    enterNextDelay={500}
                    disableFocusListener={true}
                    disableHoverListener={disableHoverListener}
                    classes={{
                      tooltipPlacementTop: classes.tooltipTop,
                      arrow: classes.arrow,
                    }}
                    title={
                      enableTooltips ? (
                        <CaptureTooltip
                          capture={capture}
                          toggleDrawer={createToggleDrawerHandler}
                        />
                      ) : (
                        ''
                      )
                    }
                  >
                    <TableRow
                      key={capture.id}
                      onClick={createToggleDrawerHandler(capture.id)}
                      className={classes.tableRow}
                    >
                      {columns.map(({ attr, renderer }, i) => (
                        <TableCell key={`${attr}_${i}`}>
                          {formatCell(
                            capture,
                            speciesLookup,
                            captureTagLookup[capture.id] || [],
                            attr,
                            renderer
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Tooltip>
                ))}
            </>
          )}
        </TableBody>
      </Table>
      {tablePagination()}
      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={isDetailsPaneOpen}
          capture={capture}
          captureType={CaptureType.Capture}
          onClose={closeDrawer}
        />
      </CaptureDetailProvider>
    </Grid>
  );
};

export const formatCell = (
  capture,
  speciesLookup,
  additionalTags,
  attr,
  renderer
) => {
  if (attr === 'id' || attr === 'planterId') {
    return (
      <LinkToWebmap
        value={capture[attr]}
        type={attr === 'id' ? 'tree' : 'user'}
      />
    );
  } else if (attr === 'speciesId') {
    return capture[attr] === null ? '--' : speciesLookup[capture[attr]];
  } else if (attr === 'verificationStatus') {
    return capture['active'] === null || capture['approved'] === null
      ? '--'
      : getVerificationStatus(capture['active'], capture['approved']);
  } else if (attr === 'status') {
    return capture['status'];
  } else if (attr === 'captureTags') {
    return [
      capture.morphology ? `morphology: ${capture.morphology}` : '',
      capture.captureApprovalTag
        ? `approval tag: ${capture.captureApprovalTag}`
        : '',
      ...additionalTags,
    ]
      .filter((tag) => tag !== null)
      .join('\n');
  } else {
    return renderer ? renderer(capture[attr]) : capture[attr];
  }
};

export default CaptureTable;
