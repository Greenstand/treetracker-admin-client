import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  forwardRef,
} from 'react';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Drawer from '@material-ui/core/Drawer';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Species from './Species';

import FilterTop from './FilterTop';
import CheckIcon from '@material-ui/icons/Check';
import Person from '@material-ui/icons/Person';
import Nature from '@material-ui/icons/Nature';
import Map from '@material-ui/icons/Map';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Navbar from './Navbar';
import PlanterDetail from './PlanterDetail';
import CaptureTags from './CaptureTags';
import CaptureDetailDialog from './CaptureDetailDialog';
import withData from './common/withData';
import OptimizedImage from './OptimizedImage';
import { LocationOn } from '@material-ui/icons';
import { countToLocaleString } from '../common/numbers';
import { VerifyContext } from '../context/VerifyContext';
import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';

const log = require('loglevel').getLogger('../components/Verify');

const SIDE_PANEL_WIDTH = 315;

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

  navbar: {
    width: `calc(100% - ${SIDE_PANEL_WIDTH}px)`,
    left: 0,
    right: 'auto',
  },
  sidePanel: {
    width: SIDE_PANEL_WIDTH,
  },
  drawerPaper: {
    width: SIDE_PANEL_WIDTH,
  },
  body: {
    display: 'flex',
    height: '100%',
  },
  bodyInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidePanelContainer: {
    padding: theme.spacing(2),
    flexWrap: 'nowrap',
  },
  sidePanelItem: {
    marginTop: theme.spacing(1),
  },
  radioGroup: {
    flexDirection: 'row',
  },
  bottomLine: {
    borderBottom: '1px solid lightgray',
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
}));

const ToVerifyCounter = withData(({ data }) => (
  <>
    {data !== null &&
      `${countToLocaleString(data)} capture${data === 1 ? '' : 's'}`}
  </>
));

const Verify = (props) => {
  // console.log('render: verify');
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
  const [planterDetail, setPlanterDetail] = useState({
    isOpen: false,
    planter: {},
  });
  const refContainer = useRef();

  /*
   * effect to load page when mounted
   */
  useEffect(() => {
    log.debug('mounted:');
    // update filter right away to prevent non-Filter type objects loading
    document.title = `Verify - ${documentTitle}`;
    // context.updateFilter(context.filter);
    // context.loadCaptureImages();
    // context.getCaptureCount(context.filter);
  }, []);

  /* to display progress */
  useEffect(() => {
    setComplete(verifyContext.approveAllComplete);
  }, [verifyContext.approveAllComplete]);

  /* load more captures when the page or page size changes */
  useEffect(() => {
    verifyContext.loadCaptureImages();
  }, [verifyContext.pageSize, verifyContext.currentPage]);

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

  function handlePlanterMapClick(e, planterId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on planter:%d', planterId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${planterId}`;
    window.open(url, '_blank').opener = null;
  }

  function resetApprovalFields() {
    tagsContext.setTagInput([]);
    speciesContext.setSpeciesInput('');
  }

  async function handleSubmit(approveAction) {
    log.debug('approveAction:', approveAction);
    //check selection
    if (verifyContext.captureImagesSelected.length === 0) {
      window.alert('Please select one or more captures');
      return;
    }
    /*
     * check species
     */
    const isNew = await speciesContext.isNewSpecies();
    if (isNew) {
      const answer = await new Promise((resolve) => {
        if (
          window.confirm(
            `The species ${speciesContext.speciesInput} is a new one, create it?`,
          )
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
      if (!answer) {
        return;
      } else {
        //create new species
        await speciesContext.createSpecies();
      }
    }
    const speciesId = await speciesContext.getSpeciesId();
    if (speciesId) {
      approveAction.speciesId = speciesId;
      console.log('species id:', speciesId);
    }

    /*
     * create/retrieve tags
     */
    approveAction.tags = await props.tagDispatch.createTags();

    const result = await verifyContext.approveAll({ approveAction });
    if (!result) {
      window.alert('Failed to approve a capture');
    } else if (!approveAction.rememberSelection) {
      resetApprovalFields();
    }
    verifyContext.loadCaptureImages();
  }

  async function handleShowPlanterDetail(e, capture) {
    e.preventDefault();
    e.stopPropagation();
    setPlanterDetail({
      isOpen: true,
      planterId: capture.planterId,
    });
  }

  function handleClosePlanterDetail() {
    setPlanterDetail({
      isOpen: false,
      planterId: null,
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
    verifyContext.set({
      pageSize: event.target.value,
    });
  }

  function handleChangePage(event, page) {
    verifyContext.set({ currentPage: page });
  }

  function isCaptureSelected(id) {
    return verifyContext.captureImagesSelected.indexOf(id) >= 0;
  }

  const captureImages = verifyContext.captureImages.filter((capture, index) => {
    return (
      index >= verifyContext.currentPage * verifyContext.pageSize &&
      index < (verifyContext.currentPage + 1) * verifyContext.pageSize
    );
  });

  const placeholderImages = verifyContext.isLoading
    ? Array(verifyContext.pageSize - captureImages.length)
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
              capture.placeholder && classes.placeholderCard,
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
                    onClick={(e) => handleShowPlanterDetail(e, capture)}
                    aria-label={`Planter details`}
                    title={`Planter details`}
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
                    onClick={(e) => handlePlanterMapClick(e, capture.planterId)}
                    aria-label={`Planter map`}
                    title={`Planter map`}
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
      rowsPerPageOptions={[12, 24, 48, 96, 192]}
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
    <React.Fragment>
      <Grid item className={classes.body}>
        <Grid item className={classes.bodyInner}>
          <Grid item>
            <Navbar
              className={classes.navbar}
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
                      <ToVerifyCounter
                        needsRefresh={verifyContext.invalidateCaptureCount}
                        fetch={verifyContext.getCaptureCount}
                        data={verifyContext.captureCount}
                      />
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
        !context.isRejectAllProcessing &&
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
      <PlanterDetail
        open={planterDetail.isOpen}
        planterId={planterDetail.planterId}
        onClose={() => handleClosePlanterDetail()}
      />
      <CaptureDetailDialog
        open={captureDetail.isOpen}
        onClose={() => handleCloseCaptureDetail()}
        capture={captureDetail.capture}
      />
    </React.Fragment>
  );
};

function SidePanel(props) {
  const DEFAULT_SWITCH_APPROVE = 0;
  const DEFAULT_MORPHOLOGY = 'seedling';
  const DEFAULT_AGE = 'new_tree';
  const DEFAULT_CAPTURE_APPROVAL_TAG = 'simple_leaf';
  const DEFAULT_REJECTION_REASON = 'not_tree';

  const classes = useStyles(props);
  const [switchApprove, setSwitchApprove] = React.useState(
    DEFAULT_SWITCH_APPROVE,
  );
  const [morphology, setMorphology] = React.useState(DEFAULT_MORPHOLOGY);
  const [age, setAge] = React.useState(DEFAULT_AGE);
  const [captureApprovalTag, setCaptureApprovalTag] = React.useState(
    DEFAULT_CAPTURE_APPROVAL_TAG,
  );
  const [rejectionReason, setRejectionReason] = React.useState(
    DEFAULT_REJECTION_REASON,
  );
  const [rememberSelection, setRememberSelection] = React.useState(false);

  function resetSelection() {
    setSwitchApprove(DEFAULT_SWITCH_APPROVE);
    setMorphology(DEFAULT_MORPHOLOGY);
    setAge(DEFAULT_AGE);
    setCaptureApprovalTag(DEFAULT_CAPTURE_APPROVAL_TAG);
    setRejectionReason(DEFAULT_REJECTION_REASON);
  }

  async function handleSubmit() {
    const approveAction =
      switchApprove === 0
        ? {
            isApproved: true,
            morphology,
            age,
            captureApprovalTag,
            rememberSelection,
          }
        : {
            isApproved: false,
            rejectionReason,
            rememberSelection,
          };
    await props.onSubmit(approveAction);
    if (!rememberSelection) {
      resetSelection();
    }
  }

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      className={classes.sidePanel}
      classes={{
        paper: classes.drawerPaper,
      }}
      elevation={11}
    >
      <Grid
        container
        direction={'column'}
        className={classes.sidePanelContainer}
      >
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={switchApprove}
          >
            <Tab
              label="APPROVE"
              id="full-width-tab-0"
              aria-controls="full-width-tabpanel-0"
              onClick={() => setSwitchApprove(0)}
            />
            <Tab
              label="REJECT"
              id="full-width-tab-0"
              aria-controls="full-width-tabpanel-0"
              onClick={() => setSwitchApprove(1)}
            />
          </Tabs>
          {switchApprove === 0 && (
            <>
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Morphology
                </Typography>
              </Grid>
              <Grid
                className={`${classes.bottomLine} ${classes.sidePanelItem}`}
              >
                <RadioGroup value={morphology} className={classes.radioGroup}>
                  <FormControlLabel
                    value="seedling"
                    onClick={() => setMorphology('seedling')}
                    control={<Radio />}
                    label="Seedling"
                  />
                  <FormControlLabel
                    value="direct_seedling"
                    control={<Radio />}
                    onClick={() => setMorphology('direct_seedling')}
                    label="Direct seeding"
                  />
                  <FormControlLabel
                    onClick={() => setMorphology('fmnr')}
                    value="fmnr"
                    control={<Radio />}
                    label="Pruned/tied (FMNR)"
                  />
                </RadioGroup>
              </Grid>
              <Grid
                className={`${classes.bottomLine} ${classes.sidePanelItem}`}
              >
                <Typography variant="h6">Age</Typography>
                <RadioGroup value={age} className={classes.radioGroup}>
                  <FormControlLabel
                    onClick={() => setAge('new_tree')}
                    value="new_tree"
                    control={<Radio />}
                    label="New tree(s)"
                  />
                  <FormControlLabel
                    onClick={() => setAge('over_two_years')}
                    value="over_two_years"
                    control={<Radio />}
                    label="> 2 years old"
                  />
                </RadioGroup>
              </Grid>
              {/*
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <RadioGroup className={classes.radioGroup}>
            <FormControlLabel disabled value='Create token' control={<Radio/>} label='Create token' />
            <FormControlLabel disabled value='No token' control={<Radio/>} label='No token' />
          </RadioGroup>
        </Grid>
        */}
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Species (if known)
                </Typography>
                <Species />
              </Grid>
              <Grid>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Additional tags
                </Typography>
                <CaptureTags placeholder="Add other text tags" />
                <br />
              </Grid>
              <RadioGroup
                className={classes.sidePanelItem}
                value={captureApprovalTag}
              >
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('simple_leaf')}
                  value="simple_leaf"
                  control={<Radio />}
                  label="Simple leaf"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('complex_leaf')}
                  value="complex_leaf"
                  control={<Radio />}
                  label="Complex leaf"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('acacia_like')}
                  value="acacia_like"
                  control={<Radio />}
                  label="Acacia-like"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('conifer')}
                  value="conifer"
                  control={<Radio />}
                  label="Conifer"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('fruit')}
                  value="fruit"
                  control={<Radio />}
                  label="Fruit"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('mangrove')}
                  value="mangrove"
                  control={<Radio />}
                  label="Mangrove"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('palm')}
                  value="palm"
                  control={<Radio />}
                  label="Palm"
                />
                <FormControlLabel
                  onClick={() => setCaptureApprovalTag('timber')}
                  value="timber"
                  control={<Radio />}
                  label="Timber"
                />
              </RadioGroup>
            </>
          )}
          {switchApprove === 1 && (
            <>
              <RadioGroup
                className={classes.sidePanelItem}
                value={rejectionReason}
              >
                <FormControlLabel
                  onClick={() => setRejectionReason('not_tree')}
                  value="not_tree"
                  control={<Radio />}
                  label="Not a tree"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('unapproved_tree')}
                  value="unapproved_tree"
                  control={<Radio />}
                  label="Not an approved tree"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('blurry_image')}
                  value="blurry_image"
                  control={<Radio />}
                  label="Blurry photo"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('dead')}
                  value="dead"
                  control={<Radio />}
                  label="Dead"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('duplicate_image')}
                  value="duplicate_image"
                  control={<Radio />}
                  label="Duplicate photo"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('flag_user')}
                  value="flag_user"
                  control={<Radio />}
                  label="Flag user!"
                />
                <FormControlLabel
                  onClick={() => setRejectionReason('needs_contact_or_review')}
                  value="needs_contact_or_review"
                  control={<Radio />}
                  label="Flag capture for contact/review"
                />
              </RadioGroup>
              <Grid className={classes.mb}>
                <Typography className={classes.sidePanelItem} variant="h6">
                  Additional tags
                </Typography>
                <CaptureTags placeholder="Add other text tags" />
              </Grid>
            </>
          )}
        </Grid>
        {/*Hidden until functionality is implemented. Issuer: https://github.com/Greenstand/treetracker-admin/issues/371*/}
        {false && (
          <Grid className={`${classes.sidePanelItem}`}>
            <TextField placeholder="Note (optional)"></TextField>
          </Grid>
        )}
        {/* <Grid className={`${classes.sidePanelItem}`}>
        </Grid> */}
        <Grid
          container
          className={`${classes.sidePanelItem}`}
          justify="space-between"
        >
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!props.submitEnabled}
            className={`${classes.sidePanelSubmitButton}`}
          >
            SUBMIT
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberSelection}
                onChange={(event) => setRememberSelection(event.target.checked)}
                name="remember"
                color="secondary"
              />
            }
            label="Remember selection"
          />
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default Verify;
