import React, { useEffect, useState, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  Button, // replace with icons down the line
  Grid,
  AppBar,
  Modal,
  LinearProgress,
  IconButton,
  Snackbar,
  Avatar,
  Paper,
  Box,
  TablePagination,
  Divider,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import IconFilter from '@material-ui/icons/FilterList';
import CheckIcon from '@material-ui/icons/Check';
import { LocationOn, Person, Nature, Map } from '@material-ui/icons';
import Navbar from './Navbar';
import GrowerDetail from './GrowerDetail';
// import CaptureTags from './CaptureTags';
import SidePanel from './SidePanel';
import FilterTop from './FilterTop';
import CaptureDetailDialog from './CaptureDetailDialog';
import OptimizedImage from './OptimizedImage';
import CaptureDetailTooltip from './CaptureDetailTooltip';
import { documentTitle } from 'common/variables';
import { countToLocaleString } from 'common/numbers';
import { VerifyContext } from 'context/VerifyContext';
import { SpeciesContext } from 'context/SpeciesContext';
import { TagsContext } from 'context/TagsContext';
import { CaptureDetailProvider } from 'context/CaptureDetailContext';

const log = require('loglevel').getLogger('components/Verify');
const EMPTY_ARRAY = new Array(16).fill();
const SIDE_PANEL_WIDTH = 315;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 8),
  },
  card: {
    position: 'relative',
    display: 'grid',
    padding: 0,
    cursor: 'pointer',
    borderRadius: '16px',
    '&:hover $cardMedia': {
      transform: 'scale(1.04)',
    },
    '&:hover $cardActions': {
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.easeInOut,
        duration: '.8s',
      }),
    },
    '&:hover $cardDetail': {
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.easeInOut,
        duration: '.8s',
      }),
    },
  },
  cardWrapper: {
    padding: theme.spacing(2),
  },
  cardCheckbox: {
    gridArea: '1/-1',
    height: '1.2em',
    width: '1.2em',
    margin: '4px',
    pointerEvents: 'none',
    borderRadius: '50%',
    zIndex: 1,
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
    borderRadius: '24px',
  },
  cardMedia: {
    gridArea: '1/-1',
    transform: 'scale(1)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeInOut,
      duration: '0.2s',
    }),
  },
  cardActions: {
    gridArea: '1/-1',
    alignSelf: 'end',
    display: 'flex',
    zIndex: '1',
    opacity: 0,
    padding: '4px',
  },
  cardDetail: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    width: '96%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  placeholderCard: {
    pointerEvents: 'none',
    '& $card': {
      background: '#eee',
      '& *': {
        opacity: 0,
      },
    },
  },
  title: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 8),
  },
  titleLeft: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBottom: {
    justifyContent: 'flex-end',
    padding: theme.spacing(2, 8),
  },
  snackbar: {
    bottom: 20,
  },
  snackbarContent: {
    backgroundColor: theme.palette.action.active,
  },
  body: {
    display: 'flex',
    height: '100%',
  },
  bodyInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  activeFilters: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginLeft: '0.75rem',
    backgroundColor: theme.palette.stats.green,
    fontSize: 'smaller',
    fontWeight: 'bold',
  },
  '@media (max-width: 1070px)': {
    paginationContainer: {
      '@media (max-width: 1070px)': {
        display: 'flex',
        flexGrow: 1,
      },
    },
    pagination: {
      width: '100%',
    },
  },
  imageSizeLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.6875rem',
    paddingRight: '.25rem',
  },
  imageSizeToggle: {
    textTransform: 'none',
    fontSize: '0.6875rem',
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    color: 'black',
    '&.Mui-selected': {
      borderColor: theme.palette.action.active,
    },
    '&.Mui-selected span': {
      color: theme.palette.stats.green,
    },
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
  },
  label: {
    '@media (max-width: 1070px)': {
      display: 'none',
    },
  },
}));

const Verify = (props) => {
  const verifyContext = useContext(VerifyContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const classes = useStyles(props);
  const [complete, setComplete] = useState(0);
  const [isFilterShown, setFilterShown] = useState(false);
  const [isImagesLarge, setImagesLarge] = useState(true);
  const [captureDetail, setCaptureDetail] = useState({
    isOpen: false,
    capture: null,
  });
  const [growerDetail, setGrowerDetail] = useState({
    isOpen: false,
    growerId: {},
  });
  const captureSelected = verifyContext.getCaptureSelectedArr();
  const numFilters = verifyContext.filter.countAppliedFilters();

  /*
   * effect to load page when mounted
   */

  useEffect(() => {
    log.debug('verify mounted:');
    // update filter right away to prevent non-Filter type objects loading
    document.title = `Verify - ${documentTitle}`;
  }, []);

  /* to display progress */
  useEffect(() => {
    setComplete(verifyContext.approveAllComplete);
  }, [verifyContext.approveAllComplete]);

  const handleCaptureClick = (captureId) => (e) => {
    e.stopPropagation();
    log.debug('click on capture:', captureId);
    verifyContext.clickCapture({
      captureId,
      isShift: e.shiftKey,
    });
  };

  const handleCapturePinClick = (captureId) => (e) => {
    e.stopPropagation();
    log.debug('click on capture pin:', captureId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${captureId}`;
    window.open(url, '_blank').opener = null;
  };

  const handleGrowerMapClick = (growerId) => (e) => {
    e.stopPropagation();
    log.debug('click on grower:', growerId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${growerId}`;
    window.open(url, '_blank').opener = null;
  };

  function resetApprovalFields() {
    tagsContext.setTagInput([]);
    speciesContext.setSpeciesInput('');
  }

  async function handleSubmit(approveAction) {
    // log.debug('approveAction:', approveAction);
    //check selection
    if (captureSelected.length === 0) {
      window.alert('Please select one or more captures');
      return;
    }
    const speciesId = await speciesContext.getSpeciesId();
    if (speciesId) {
      approveAction.speciesId = speciesId;
    }

    /*
     * if approved, create new tags and return all the applied tags
     */
    if (approveAction.isApproved) {
      const tags = await tagsContext.createTags();
      log.debug('TAGS -->', tags);
      approveAction.tags = tags.map((t) => t.id);
    }
    const result = await verifyContext.approveAll(approveAction);
    log.debug('APPROVED captures --->', result);

    if (!result) {
      window.alert('Failed to approve/reject a capture');
    } else if (!approveAction.rememberSelection) {
      resetApprovalFields();
    }
  }

  const handleShowGrowerDetail = (growerId) => (e) => {
    e.stopPropagation();
    setGrowerDetail({
      isOpen: true,
      growerId,
    });
  };

  function handleCloseGrowerDetail() {
    setGrowerDetail({
      isOpen: false,
      growerId: null,
    });
  }

  const handleShowCaptureDetail = (capture) => (e) => {
    e.stopPropagation();
    setCaptureDetail({
      isOpen: true,
      capture: capture.id,
    });
  };

  function handleCloseCaptureDetail() {
    setCaptureDetail({
      isOpen: false,
      capture: null,
    });
  }

  function handleChangePageSize(event) {
    verifyContext.setCurrentPage(0);
    verifyContext.setPageSize(event.target.value);
  }

  function handleChangePage(event, page) {
    verifyContext.setCurrentPage(page);
  }

  const captureImages = verifyContext.captureImages;

  const placeholderImages = verifyContext.isLoading
    ? Array(Math.max(verifyContext.pageSize - captureImages.length, 0))
        .fill()
        .map((_, index) => {
          return {
            id: index,
            placeholder: true,
          };
        })
    : [];

  /*=============================================================*/
  const makeCardStyles = makeStyles(() => {
    const WIDTH = isImagesLarge ? 350 : 250;

    const styles = EMPTY_ARRAY.reduce((next, _, idx) => {
      let style = {
        cardElement: {
          width: `calc(100% / ${idx ? idx : 1})`,
        },
      };
      const key = `@media (min-width: ${WIDTH * idx + SIDE_PANEL_WIDTH}px)
                      and (max-width: ${
                        WIDTH * (idx + 1) + SIDE_PANEL_WIDTH
                      }px)`;
      next[key] = style;
      return next;
    }, {});

    return styles;
  });

  const cardStyles = makeCardStyles();

  const captureImageItems = captureImages
    .concat(placeholderImages)
    .map((capture) => {
      return (
        <Box key={capture.id} className={cardStyles.cardElement}>
          <Box
            p={2}
            className={clsx(
              verifyContext.captureImagesSelected[capture.id]
                ? classes.cardSelected
                : undefined,
              capture.placeholder && classes.placeholderCard
            )}
          >
            <Card
              onClick={handleCaptureClick(capture.id)}
              id={`card_${capture.id}`}
              className={classes.card}
              elevation={capture.placeholder ? 0 : 3}
            >
              <Paper className={classes.cardCheckbox} elevation={4}>
                {verifyContext.captureImagesSelected[capture.id] && (
                  <CheckIcon />
                )}
              </Paper>

              <OptimizedImage
                src={capture.image_url}
                width={isImagesLarge ? 400 : 250}
                className={classes.cardMedia}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alertWidth="100%"
                alertHeight="200%"
                alertPosition="absolute"
                alertPadding="5rem 0 0 1rem"
                alertTitleSize="1.6rem"
                alertTextSize="1rem"
              />

              <Grid className={classes.cardActions}>
                <IconButton
                  className={classes.iconButton}
                  onClick={handleShowGrowerDetail(capture.grower_account_id)}
                  aria-label={`Grower details`}
                  name={`Grower details`}
                  title={`Grower details`}
                >
                  <Person color="primary" />
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={handleShowCaptureDetail(capture)}
                  aria-label={`Capture details`}
                  name={`Capture details`}
                  title={`Capture details`}
                >
                  <Nature color="primary" />
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={handleCapturePinClick(capture.reference_id)}
                  aria-label={`Capture location`}
                  name={`Capture location`}
                  title={`Capture location`}
                >
                  <LocationOn color="primary" />
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={handleGrowerMapClick(capture.grower_account_id)}
                  aria-label={`Grower map`}
                  name={`Grower map`}
                  title={`Grower map`}
                >
                  <Map color="primary" />
                </IconButton>
              </Grid>

              <Box className={classes.cardDetail}>
                <CaptureDetailTooltip
                  capture={capture}
                  showCaptureClick={handleShowCaptureDetail}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      );
    });
  /*=============================================================*/

  function handleFilterClick() {
    setFilterShown(!isFilterShown);
  }

  let imagePagination = (
    <TablePagination
      rowsPerPageOptions={[24, 96, 192, 384]}
      component="div"
      count={verifyContext.captureCount || 0}
      rowsPerPage={verifyContext.pageSize}
      page={verifyContext.currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangePageSize}
      labelRowsPerPage={
        <span className={classes.label}>Captures per page:</span>
      }
      className={classes.pagination}
    />
  );

  let imageSizeControl = (
    <>
      <Typography className={classes.imageSizeLabel}>Images:</Typography>

      <ToggleButtonGroup
        value={isImagesLarge === true ? 'large' : 'small'}
        exclusive
        aria-label="image size"
      >
        <ToggleButton
          value="small"
          aria-label="small"
          onClick={() => setImagesLarge(false)}
          className={classes.imageSizeToggle}
        >
          Small
        </ToggleButton>

        <ToggleButton
          value="large"
          aria-label="large"
          onClick={() => setImagesLarge(true)}
          className={classes.imageSizeToggle}
        >
          Large
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );

  return (
    <>
      <Grid item className={classes.body}>
        <Grid item className={classes.bodyInner}>
          <Navbar
            buttons={[
              <Button
                variant="outlined"
                color="primary"
                onClick={handleFilterClick}
                startIcon={<IconFilter />}
                key={1}
              >
                Filter
                {numFilters > 0 && (
                  <Avatar className={classes.activeFilters}>
                    {numFilters}
                  </Avatar>
                )}
              </Button>,
            ]}
          >
            {isFilterShown && (
              <FilterTop
                isOpen={isFilterShown}
                onSubmit={(filter) => {
                  verifyContext.updateFilter(filter);
                }}
                filter={verifyContext.filter}
                onClose={handleFilterClick}
              />
            )}
          </Navbar>

          <Box style={{ overflow: 'hidden auto' }}>
            <Grid container className={classes.title}>
              <Box className={classes.titleLeft}>
                <Typography variant="h5">
                  {verifyContext.captureCount !== null &&
                    `${countToLocaleString(
                      verifyContext.captureCount
                    )} capture${verifyContext.captureCount === 1 ? '' : 's'}`}
                </Typography>

                <Box display="flex" ml={2} mr={2}>
                  {imageSizeControl}
                </Box>
              </Box>

              <Box className={classes.paginationContainer}>
                {imagePagination}
              </Box>
            </Grid>

            <Divider width="100%" />
            <Grid container className={classes.wrapper}>
              {captureImageItems}
            </Grid>
            <Divider width="100%" />

            <Grid container className={classes.titleBottom}>
              {imagePagination}
            </Grid>
          </Box>
        </Grid>
        <SidePanel
          onSubmit={handleSubmit}
          submitEnabled={captureSelected && captureSelected.length > 0}
        />
      </Grid>
      {verifyContext.isLoading && (
        <AppBar
          position="fixed"
          style={{
            zIndex: 10000,
          }}
        >
          <LinearProgress
            color="primary"
            variant="determinate"
            value={complete}
          />
        </AppBar>
      )}
      {verifyContext.isLoading && (
        <Modal open={true}>
          <div></div>
        </Modal>
      )}
      {false /* disabled until we can delete approved captures and prevent updating previously updated records */ &&
        !verifyContext.isLoading &&
        verifyContext.isApproveAllProcessing &&
        verifyContext.captureImagesUndo.length > 0 && (
          <Snackbar
            open
            autoHideDuration={15000}
            ContentProps={{
              className: classes.snackbarContent,
              'aria-describedby': 'snackbar-fab-message-id',
            }}
            message={
              <span id="snackbar-fab-message-id">
                You have{' '}
                {verifyContext.isBulkApproving ? ' approved ' : ' rejected '}
                {verifyContext.captureImagesUndo.length} captures
              </span>
            }
            color="primary"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={async () => {
                  await verifyContext.undoAll();
                  log.log('finished');
                }}
              >
                Undo
              </Button>
            }
            className={classes.snackbar}
          />
        )}
      {growerDetail.isOpen && (
        <GrowerDetail
          open={growerDetail.isOpen}
          growerId={growerDetail.growerId}
          onClose={handleCloseGrowerDetail}
        />
      )}
      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={captureDetail.isOpen}
          onClose={handleCloseCaptureDetail}
          captureId={captureDetail.capture}
          page={'VERIFY'}
        />
      </CaptureDetailProvider>
    </>
  );
};

export default Verify;
