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
  Link,
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { getDateTimeStringLocale } from '../../common/locale';
import { getVerificationStatus } from '../../common/utils';
import LinkToWebmap from '../common/LinkToWebmap';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';
import { TagsContext } from 'context/TagsContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import CaptureTooltip from './CaptureTooltip';
import ExportCaptures from 'components/ExportCaptures';
import Spinner from 'components/common/Spinner';
import api from '../../api/treeTrackerApi';
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
    label: 'Token ID',
    renderer: (val) => val,
  },
  {
    attr: 'wallet',
    label: 'Wallet',
    renderer: (val) => val,
  },
  {
    attr: 'captureTags',
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
    attr: 'timeCreated',
    label: 'Created',
    renderer: (val) => getDateTimeStringLocale(val),
  },
  {
    attr: 'lon',
    label: 'Longitude',
    renderer: (val) => Number(val).toFixed(6),
  },
  {
    attr: 'lat',
    label: 'Latitude',
    renderer: (val) => Number(val).toFixed(6),
  },
  {
    attr: 'imageUrl',
    label: 'Image URL',
    renderer: (val) => (
      <Link
        href={val}
        underline="always"
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'inline-block' }}
      >
        Open in new tab
      </Link>
    ),
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
    captureCount,
    isLoading,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
  } = useContext(CapturesContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const [captureDetail, setCaptureDetail] = useState({
    id: null,
    isDetailsPaneOpen: false,
  });
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
    const captureTags = await api.getCaptureTags({
      captureIds: captures.map((c) => c.uuid),
    });

    // Populate a lookup for quick access when rendering the table
    let lookup = {};
    captureTags.forEach((captureTag) => {
      if (!lookup[captureTag.treeId]) {
        lookup[captureTag.treeId] = [];
      }
      lookup[captureTag.treeId].push(tagLookup[captureTag.tagId]);
    });
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
    setTagLookup(tags);
  };

  const toggleDrawer = (id) => {
    setCaptureDetail({
      id,
      isDetailsPaneOpen: true,
    });
  };

  const createToggleDrawerHandler = (id) => {
    return () => {
      toggleDrawer(id);
    };
  };

  const closeDrawer = () => {
    setDisableHoverListener(false);

    setCaptureDetail({
      id: null,
      isDetailsPaneOpen: false,
    });
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
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
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
        </TableBody>
      </Table>

      {isLoading && <Spinner />}

      {tablePagination()}

      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={captureDetail.isDetailsPaneOpen}
          captureId={captureDetail.id}
          onClose={closeDrawer}
          page={'LEGACY'}
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
  } else if (attr === 'captureTags') {
    return [
      capture.age,
      capture.morphology,
      capture.captureApprovalTag,
      capture.rejectionReason,
      ...additionalTags,
    ]
      .filter((tag) => tag !== null)
      .join(', ');
  } else {
    return renderer ? renderer(capture[attr]) : capture[attr];
  }
};

export default CaptureTable;
