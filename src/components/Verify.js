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
}));

const Verify = (props) => {
  const verifyContext = useContext(VerifyContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const classes = useStyles(props);
  const [complete, setComplete] = useState(0);
  const [isFilterShown, setFilterShown] = useState(false);
  const [captureDetail, setCaptureDetail] = useState({
    isOpen: false,
    capture: {},
  });
  const [growerDetail, setGrowerDetail] = useState({
    isOpen: false,
    grower: {},
  });
  const refContainer = useRef();
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
    // console.log('-- approve all complete');
    setComplete(verifyContext.approveAllComplete);
  }, [verifyContext.approveAllComplete]);

  function handleCaptureClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture:%d', captureId);
    verifyContext.clickCapture({
      captureId,
      isShift: e.shiftKey,
      isCmd: e.metaKey,
      isCtrl: e.ctrlKey,
    });
  }

  function handleCapturePinClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture pin:%d', captureId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${captureId}`;
    window.open(url, '_blank').opener = null;
  }

  function handleGrowerMapClick(e, growerId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on grower:%d', growerId);
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
    if (verifyContext.captureImagesSelected.length === 0) {
      window.alert('Please select one or more captures');
      return;
    }
    const speciesId = await speciesContext.getSpeciesId();
    if (speciesId) {
      approveAction.speciesId = speciesId;
      console.log('species id:', speciesId);
    }

    /*
     * create/retrieve tags
     */
    approveAction.tags = await tagsContext.createTags();
    const result = await verifyContext.approveAll(approveAction);
    if (!result) {
      window.alert('Failed to approve a capture');
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
    setCaptureDetail({
      isOpen: true,
      capture,
    });
  }

  function handleCloseCaptureDetail() {
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

  function isCaptureSelected(id) {
    return verifyContext.captureImagesSelected.indexOf(id) >= 0;
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

  const captureImageItems = captureImages
    .concat(placeholderImages)
    .map((capture) => {
      return (
        <Grid item xs={12} sm={6} md={4} xl={3} key={capture.id}>
          <div
            className={clsx(
              classes.cardWrapper,
              isCaptureSelected(capture.id) ? classes.cardSelected : undefined,
              capture.placeholder && classes.placeholderCard
            )}
          >
            {isCaptureSelected(capture.id) && (
              <Paper className={classes.cardCheckbox} elevation={4}>
                <CheckIcon />
              </Paper>
            )}
            <Card
              onClick={(e) => handleCaptureClick(e, capture.id)}
              id={`card_${capture.id}`}
              className={classes.card}
              elevation={capture.placeholder ? 0 : 3}
            >
              <CardContent className={classes.cardContent}>
                <OptimizedImage
                  src={capture.imageUrl}
                  width={400}
                  className={classes.cardMedia}
                />
              </CardContent>

              <Grid justify="center" container className={classes.cardActions}>
                <Grid item>
                  <IconButton
                    onClick={(e) => handleShowGrowerDetail(e, capture)}
                    aria-label={`Grower details`}
                    title={`Grower details`}
                  >
                    <Person color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleShowCaptureDetail(e, capture)}
                    aria-label={`Capture details`}
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
                    onClick={(e) => handleGrowerMapClick(e, capture.planterId)}
                    aria-label={`Grower map`}
                    title={`Grower map`}
                  >
                    <Map color="primary" />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Grid>
      );
    });

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
    />
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
                  justify="space-between"
                  alignItems="center"
                  className={classes.title}
                >
                  <Grid item>
                    <Typography variant="h5">
                      {verifyContext.captureCount !== null &&
                        `${countToLocaleString(
                          verifyContext.captureCount
                        )} capture${
                          verifyContext.captureCount === 1 ? '' : 's'
                        }`}
                    </Typography>
                  </Grid>
                  <Grid item>{imagePagination}</Grid>
                </Grid>
              </Grid>
              <Grid
                item
                style={{
                  width: '100%',
                }}
              >
                <Grid container className={classes.wrapper} spacing={1}>
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
          submitEnabled={verifyContext.captureImagesSelected.length > 0}
        />
      </Grid>
      {verifyContext.isApproveAllProcessing && (
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
      {verifyContext.isApproveAllProcessing && (
        <Modal open={true}>
          <div></div>
        </Modal>
      )}
      {false /* close undo */ &&
        !verifyContext.isApproveAllProcessing &&
        // !context.isRejectAllProcessing &&
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
        onClose={() => handleCloseGrowerDetail()}
      />
      <CaptureDetailProvider>
        <CaptureDetailDialog
          open={captureDetail.isOpen}
          onClose={() => handleCloseCaptureDetail()}
          capture={captureDetail.capture}
        />
      </CaptureDetailProvider>
    </>
  );
};

export default Verify;
