import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'; // replace with icons down the line

import { selectedHighlightColor, documentTitle } from '../common/variables.js';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconFilter from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import FilterTop from './FilterTop';
import CheckIcon from '@material-ui/icons/Check';
import Person from '@material-ui/icons/Person';
import Nature from '@material-ui/icons/Nature';
import Map from '@material-ui/icons/Map';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Navbar from './Navbar';
import GrowerDetail from './GrowerDetail';
// import CaptureTags from './CaptureTags';
import SidePanel from './SidePanel';
import CaptureDetailDialog from './CaptureDetailDialog';
import OptimizedImage from './OptimizedImage';
import { LocationOn } from '@material-ui/icons';
import { countToLocaleString } from '../common/numbers';
import { VerifyContext } from '../context/VerifyContext';
import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';
import { CaptureDetailProvider } from '../context/CaptureDetailContext';
import CaptureDetailTooltip from './CaptureDetailTooltip';

const log = require('loglevel').getLogger('../components/Verify');

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 8, 4, 8),
  },
  cardImg: {
    width: '100%',
    height: 'auto',
  },
  cardTitle: {
    color: '#f00',
  },
  card: {
    cursor: 'pointer',
    '&:hover $cardMedia': {
      transform: 'scale(1.04)',
    },
  },
  cardCheckbox: {
    position: 'absolute',
    height: '1.2em',
    width: '1.2em',
    top: '0.2rem',
    left: '0.3rem',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardContent: {
    padding: '87% 0 0 0',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`,
  },
  cardMedia: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'scale(1)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeInOut,
      duration: '0.2s',
    }),
  },
  cardWrapper: {
    position: 'relative',
    padding: theme.spacing(2),
    flex: '1 0 45%',
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
    padding: theme.spacing(2, 8),
  },
  snackbar: {
    bottom: 20,
  },
  snackbarContent: {
    backgroundColor: theme.palette.action.active,
  },
  cardActions: {
    display: 'flex',
    padding: theme.spacing(0, 2),
  },
  button: {
    marginRight: '8px',
  },
  body: {
    display: 'flex',
    height: '100%',
  },
  bodyInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  tooltip: {
    maxWidth: 'none',
  },
  MuiDialogActionsSpacing: {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  sidePanelSubmitButton: {
    width: '128px',
  },
  mb: {
    marginBottom: '1rem',
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
}));

const Verify = (props) => {
  const verifyContext = useContext(VerifyContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const classes = useStyles(props);
  const [complete, setComplete] = useState(0);
  const [isFilterShown, setFilterShown] = useState(false);
  const [disableHoverListener, setDisableHoverListener] = useState(false);
  const [isImagesLarge, setImagesLarge] = useState(true);
  const [captureDetail, setCaptureDetail] = useState({
    isOpen: false,
    capture: {},
  });
  const [growerDetail, setGrowerDetail] = useState({
    isOpen: false,
    grower: {},
  });
  const refContainer = useRef();
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

  function handleCaptureClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture:', captureId);
    verifyContext.clickCapture({
      captureId,
      isShift: e.shiftKey,
    });
  }

  function handleCapturePinClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture pin:', captureId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${captureId}`;
    window.open(url, '_blank').opener = null;
  }

  function handleGrowerMapClick(e, growerId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on grower:', growerId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${growerId}`;
    window.open(url, '_blank').opener = null;
  }

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
     * create new tags and return all the applied tags
     */
    const appliedTags = await tagsContext.createTags();
    approveAction.tags = appliedTags.map((tag) => tag.id);
    const result = await verifyContext.approveAll(approveAction);
    if (!result) {
      window.alert('Failed to approve/reject a capture');
    } else if (!approveAction.rememberSelection) {
      resetApprovalFields();
    }
  }

  async function handleShowGrowerDetail(e, capture) {
    e.preventDefault();
    e.stopPropagation();
    setGrowerDetail({
      isOpen: true,
      growerId: capture.planterId,
    });
  }

  function handleCloseGrowerDetail() {
    setGrowerDetail({
      isOpen: false,
      growerId: null,
    });
  }

  function handleShowCaptureDetail(e, capture) {
    e.preventDefault();
    e.stopPropagation();
    setDisableHoverListener(true);
    setCaptureDetail({
      isOpen: true,
      capture,
    });
  }

  function handleCloseCaptureDetail() {
    setDisableHoverListener(false);
    setCaptureDetail({
      isOpen: false,
      capture: {},
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

  const tooltipStyles = makeStyles(() => ({
    tooltipTop: {
      top: '12px',
    },
    tooltipBottom: {
      top: '-16px',
    },
  }));

  const tooltipPositionStyles = tooltipStyles();

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

  const [captureImageContainerWidth, setCaptureImageContainerWidth] = useState(
    0
  );
  const refCaptureImageContainer = useRef(0);

  const handleResize = () => {
    setCaptureImageContainerWidth(refCaptureImageContainer.current.clientWidth);
  };

  useEffect(() => {
    handleResize();
  }, [refCaptureImageContainer?.current?.clientWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window]);

  // Calculate the number of captures per row based on the container width
  // and whether large or small images are toggled

  const containerWidth = captureImageContainerWidth || 100;
  const minCaptureSize = isImagesLarge ? 350 : 250; // Shouldn't this be reversed?

  const breakpoints = Array.from({ length: 16 }, (_, idx) => {
    return minCaptureSize * (idx + 1);
  });

  // The index of the next breakpoint up from the container width
  // gives the number of captures per row
  const capturesPerRow = breakpoints.findIndex((val, idx) => {
    if (idx === 0) {
      return false;
    }
    if (
      (idx === 1 && containerWidth <= val) ||
      (containerWidth > breakpoints[idx - 1] && containerWidth <= val) ||
      (containerWidth > val && idx === breakpoints.length - 1)
    ) {
      return true;
    }
    return false;
  });

  const captureImageItems = captureImages
    .concat(placeholderImages)
    .map((capture) => {
      return (
        <Grid
          item
          key={capture.id}
          style={{
            width: `calc(100% / ${capturesPerRow})`,
          }}
        >
          <div
            className={clsx(
              classes.cardWrapper,
              verifyContext.captureImagesSelected[capture.id]
                ? classes.cardSelected
                : undefined,
              capture.placeholder && classes.placeholderCard
            )}
          >
            <Tooltip
              key={capture.id}
              placement="top"
              arrow={true}
              interactive
              enterDelay={500}
              enterNextDelay={500}
              onMouseEnter={() => setDisableHoverListener(false)}
              disableHoverListener={disableHoverListener}
              classes={{
                tooltipPlacementTop: tooltipPositionStyles.tooltipTop,
              }}
              title={
                <CaptureDetailTooltip
                  capture={capture}
                  showCaptureClick={handleShowCaptureDetail}
                />
              }
            >
              <Card
                onClick={(e) => handleCaptureClick(e, capture.id)}
                id={`card_${capture.id}`}
                className={classes.card}
                elevation={capture.placeholder ? 0 : 3}
              >
                <CardContent className={classes.cardContent}>
                  <Paper className={classes.cardCheckbox} elevation={4}>
                    {verifyContext.captureImagesSelected[capture.id] && (
                      <CheckIcon />
                    )}
                  </Paper>
                  <OptimizedImage
                    src={capture.image_url}
                    width={isImagesLarge ? 400 : 250}
                    className={classes.cardMedia}
                    alertWidth="100%"
                    alertHeight="200%"
                    alertPosition="absolute"
                    alertPadding="5rem 0 0 1rem"
                    alertTitleSize="1.6rem"
                    alertTextSize="1rem"
                  />
                </CardContent>

                <Grid
                  justifyContent="center"
                  container
                  className={classes.cardActions}
                >
                  <Grid item>
                    <IconButton
                      onClick={(e) => handleShowGrowerDetail(e, capture)}
                      aria-label={`Grower details`}
                      name={`Grower details`}
                      title={`Grower details`}
                    >
                      <Person color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleShowCaptureDetail(e, capture)}
                      aria-label={`Capture details`}
                      name={`Capture details`}
                      title={`Capture details`}
                    >
                      <Nature color="primary" />
                    </IconButton>
                    <IconButton
                      variant="link"
                      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${capture.id}`}
                      target="_blank"
                      onClick={(e) => handleCapturePinClick(e, capture.id)}
                      aria-label={`Capture location`}
                      title={`Capture location`}
                    >
                      <LocationOn color="primary" />
                    </IconButton>
                    <IconButton
                      variant="link"
                      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${capture.planterId}`}
                      target="_blank"
                      onClick={(e) =>
                        handleGrowerMapClick(e, capture.planterId)
                      }
                      aria-label={`Grower map`}
                      title={`Grower map`}
                    >
                      <Map color="primary" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Tooltip>
          </div>
        </Grid>
      );
    });

  /*=============================================================*/

  function handleFilterClick() {
    if (isFilterShown) {
      setFilterShown(false);
    } else {
      setFilterShown(true);
    }
  }

  let imagePagination = (
    <TablePagination
      rowsPerPageOptions={[24, 96, 192, 384]}
      component="div"
      count={verifyContext.captureCount || 0}
      rowsPerPage={verifyContext.pageSize}
      page={verifyContext.currentPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Captures per page:"
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
          <Grid item>
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
          </Grid>
          <Grid
            item
            ref={refContainer}
            style={{
              overflow: 'hidden auto',
            }}
          >
            <Grid container>
              <Grid
                item
                style={{
                  width: '100%',
                }}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  className={classes.title}
                >
                  <Grid
                    style={{
                      display: 'flex',
                      flexGrow: 1,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    item
                  >
                    <Typography variant="h5">
                      {verifyContext.captureCount !== null &&
                        `${countToLocaleString(
                          verifyContext.captureCount
                        )} capture${
                          verifyContext.captureCount === 1 ? '' : 's'
                        }`}
                    </Typography>

                    <div style={{ display: 'flex' }}>{imageSizeControl}</div>
                  </Grid>

                  <Grid item className={classes.paginationContainer}>
                    {imagePagination}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                style={{
                  width: '100%',
                }}
              >
                <Grid
                  container
                  className={classes.wrapper}
                  spacing={2}
                  ref={refCaptureImageContainer}
                >
                  {captureImageItems}
                </Grid>
              </Grid>
              <Grid item container justify="flex-end" className={classes.title}>
                {imagePagination}
              </Grid>
            </Grid>
          </Grid>
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
      <GrowerDetail
        open={growerDetail.isOpen}
        growerId={growerDetail.growerId}
        onClose={handleCloseGrowerDetail}
      />
      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={captureDetail.isOpen}
          onClose={handleCloseCaptureDetail}
          capture={captureDetail.capture}
          url={`${process.env.REACT_APP_QUERY_API_ROOT}/raw-captures`}
        />
      </CaptureDetailProvider>
    </>
  );
};

export default Verify;
