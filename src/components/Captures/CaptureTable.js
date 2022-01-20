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
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import Nature from '@material-ui/icons/Nature';
import Person from '@material-ui/icons/Person';
import { getDateTimeStringLocale } from '../../common/locale';
import { countToLocaleString } from '../../common/numbers';
import { getVerificationStatus } from '../../common/utils';
import LinkToWebmap from '../common/LinkToWebmap';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import { tokenizationStates } from '../../common/variables';
import useStyle from './CaptureTable.styles.js';
import ExportCaptures from 'components/ExportCaptures';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';
import { TagsContext } from 'context/TagsContext';
import api from '../../api/treeTrackerApi';
import CircularProgress from '@material-ui/core/CircularProgress';

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
];

const CaptureTable = ({
  setShowGallery,
  handleShowCaptureDetail,
  handleShowGrowerDetail,
}) => {
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
    getCaptureById,
  } = useContext(CapturesContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [speciesLookup, setSpeciesLookup] = useState({});
  const [tagLookup, setTagLookup] = useState({});
  const [captureTagLookup, setCaptureTagLookup] = useState({});
  const [isOpenExport, setOpenExport] = useState(false);
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
      captureIds: captures.map((c) => c.id),
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
      tags[t.id] = t.tagName;
    });
    setTagLookup(tags);
  };

  const toggleDrawer = (id) => {
    getCaptureById(id);
    setIsDetailsPaneOpen(!isDetailsPaneOpen);
  };

  const createToggleDrawerHandler = (id) => {
    return () => {
      toggleDrawer(id);
    };
  };

  const closeDrawer = () => {
    setIsDetailsPaneOpen(false);
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
        rowsPerPageOptions={[24, 96, 192, 384]}
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
    <Grid style={{ height: '100%', overflow: 'auto', padding: '8px 32px' }}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="h5">
          {captureCount !== null &&
            `${countToLocaleString(captureCount)} capture${
              captureCount === 1 ? '' : 's'
            }`}
        </Typography>

        <Grid className={classes.cornerTable}>
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowGallery(true)}
            startIcon={<ImageIcon />}
          >
            Gallery View
          </Button>
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
      <Table>
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
            <Grid item container className={classes.loadingIndicator}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              {captures &&
                captures.map((capture) => (
                  <TableRow
                    key={capture.id}
                    onClick={createToggleDrawerHandler(capture.id)}
                    className={classes.tableRow}
                  >
                    {columns.map(({ attr, renderer }) => (
                      <TableCell key={attr}>
                        {formatCell(
                          capture,
                          speciesLookup,
                          captureTagLookup[capture.id] || [],
                          attr,
                          renderer,
                          handleShowCaptureDetail,
                          handleShowGrowerDetail
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
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
  renderer,
  handleShowCaptureDetail,
  handleShowGrowerDetail
) => {
  if (attr === 'id') {
    return (
      <Grid item>
        {capture[attr]}
        <IconButton
          onClick={(e) => handleShowCaptureDetail(e, capture)}
          aria-label={`View/Edit Capture details`}
          title={`View/Edit Capture details`}
          style={{ padding: '0 4px 2px' }}
        >
          <Nature color="primary" />
        </IconButton>
        <LinkToWebmap value={'Map'} type={'tree'} />
      </Grid>
    );
  } else if (attr === 'planterId') {
    return (
      <Grid item>
        {capture[attr]}
        <IconButton
          onClick={(e) => handleShowGrowerDetail(e, capture.planterId)}
          aria-label={`View/Edit Grower details`}
          title={`View/Edit Grower details`}
          style={{ padding: '0 2px 2px 0' }}
        >
          <Person color="primary" />
        </IconButton>
        <LinkToWebmap value={'Map'} type={'user'} />
      </Grid>
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
