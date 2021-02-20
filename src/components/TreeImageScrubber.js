import React, { useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button'; // replace with icons down the line
import Slide from '@material-ui/core/Slide';

import { selectedHighlightColor } from '../common/variables.js';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconFilter from '@material-ui/icons/FilterList';
import Image from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Drawer from '@material-ui/core/Drawer';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Species from './Species';

import FilterTop from './FilterTop';
import { ReactComponent as TreePin } from '../components/images/highlightedPinNoStick.svg';
import CheckIcon from '@material-ui/icons/Check';
import Person from "@material-ui/icons/Person";
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Navbar from "./Navbar";
import PlanterDetail from "./PlanterDetail"
import TreeTags from './TreeTags';
import TreeDetailDialog from './TreeDetailDialog';
import withData from './common/withData'

const log = require('loglevel').getLogger('../components/TreeImageScrubber');

const SIDE_PANEL_WIDTH = 315;

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(2, 8, 4, 8)
  },
  cardImg: {
    width: '100%',
    height: 'auto'
  },
  cardTitle: {
    color: '#f00'
  },
  card: {
    cursor: 'pointer',
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
    zIndex: 1
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected
  },
  cardContent: {
    padding: '87% 0 0 0',
    position: 'relative'
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`
  },
  cardMedia: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  cardWrapper: {
    position: 'relative',
    padding: theme.spacing(2),
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.easeInOut,
      duration: '0.1s'
    }),
    '&:not($cardSelected):hover': {
      padding: 0,
    },
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
    padding: theme.spacing(2, 8)
  },
  snackbar: {
    bottom: 20
  },
  snackbarContent: {
    backgroundColor: theme.palette.action.active
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    marginRight: '8px'
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

}));

const ToVerifyCounter = withData(({data}) => <>{data !== null && `${data} trees to verify`}</>);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TreeImageScrubber = (props) => {
  log.debug('render TreeImageScrubber...');
  log.debug('complete:', props.verityState.approveAllComplete);
  const classes = useStyles(props);
  const [complete, setComplete] = React.useState(0);
  const [isFilterShown, setFilterShown] = React.useState(false);
  const [dialog, setDialog] = React.useState({ isOpen: false, tree: {} });
  const [planterDetail, setPlanterDetail] = React.useState({ isOpen: false, planter: {} })
  const refContainer = React.useRef();

  /*
   * effect to load page when mounted
   */
  useEffect(() => {
    log.debug('mounted');
    props.verityDispatch.loadTreeImages();
  }, [props.verityDispatch]);

  /* to display progress */
  useEffect(() => {
    setComplete(props.verityState.approveAllComplete);
  }, [props.verityState.approveAllComplete]);

  /* To update tree count */
  useEffect(() => {
    props.verityDispatch.getTreeCount();
  }, [props.verityDispatch, props.verityState.treeImages]);

  /* load more trees when the page or page size changes */
  useEffect(() => {
    props.verityDispatch.loadTreeImages();
  }, [props.verityDispatch, props.verityState.pageSize, props.verityState.currentPage]);

  function handleTreeClick(e, treeId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click at tree:%d', treeId);
    props.verityDispatch.clickTree({
      treeId,
      isShift: e.shiftKey,
      isCmd: e.metaKey,
      isCtrl: e.ctrlKey
    });
  }

  function handleTreePinClick(e, treeId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click at tree:%d', treeId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${treeId}`;
    window.open(url, '_blank').opener = null;
  }

  function resetApprovalFields() {
    props.tagDispatch.setTagInput([])
    props.speciesDispatch.setSpeciesInput('')
  }

  async function handleSubmit(approveAction) {
    console.log('approveAction:', approveAction)
    //check selection
    if (props.verityState.treeImagesSelected.length === 0) {
      window.alert('Please select some tree')
      return
    }
    /*
     * check species
     */
    const isNew = await props.speciesDispatch.isNewSpecies()
    if (isNew) {
      const answer = await new Promise((resolve, reject) => {
        if (window.confirm(`The species ${props.speciesState.speciesInput} is a new one, create it?`)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      if (!answer) {
        return
      } else {
        //create new species
        await props.speciesDispatch.createSpecies()
      }
    }
    const speciesId = await props.speciesDispatch.getSpeciesId()
    if (speciesId) {
      approveAction.speciesId = speciesId
      console.log('species id:', speciesId)
    }

    /*
     * create/retrieve tags
     */
    approveAction.tags = await props.tagDispatch.createTags()

    const result = await props.verityDispatch.approveAll({ approveAction });
    if (!result) {
      window.alert('sorry, failed to approve some picture');
    } else {
      resetApprovalFields();
    }
    props.verityDispatch.loadTreeImages();
  }

  async function handlePlanterDetail(e, tree) {
    e.preventDefault();
    e.stopPropagation();
    setPlanterDetail({
      isOpen: true,
      planterId: tree.planterId,
    });
  }

  function handlePlanterDetailClose() {
    setPlanterDetail({
      isOpen: false,
      planterId: null,
    })
  }

  function handleDialog(e, tree) {
    e.preventDefault();
    e.stopPropagation();
    setDialog({
      isOpen: true,
      tree,
    })
  }

  function handleDialogClose() {
    setDialog({
      isOpen: false,
      tree: {}
    })
  }

  function handleChangePageSize(event, value) {
    props.verityDispatch.set({ pageSize: event.target.value });
  }

  function handleChangePage(event, page) {
    props.verityDispatch.set({ currentPage: page });
  }

  function isTreeSelected(id) {
    return props.verityState.treeImagesSelected.indexOf(id) >= 0
  }

  const treeImages = props.verityState.treeImages.filter((tree, index) => {
    return index >= props.verityState.currentPage * props.verityState.pageSize &&
      index < (props.verityState.currentPage + 1) * props.verityState.pageSize;
  });

  const placeholderImages =
    props.verityState.isLoading ?
      Array(props.verityState.pageSize - treeImages.length)
        .fill().map((_, index) => {
          return {
            id: index,
            placeholder: true,
          };
        })
      : [];

  const treeImageItems = treeImages.concat(placeholderImages)
    .map(tree => {
      return (
        <Grid item xs={12} sm={6} md={4} xl={3} key={tree.id}>
          <div
            className={clsx(
              classes.cardWrapper,
              isTreeSelected(tree.id)
                ? classes.cardSelected
                : undefined,
              tree.placeholder && classes.placeholderCard
            )}
          >
            {isTreeSelected(tree.id) &&
              (<Paper
                className={classes.cardCheckbox}
                elevation={4}
              >
                <CheckIcon />
              </Paper>)
            }
            <Card
              onClick={e => handleTreeClick(e, tree.id)}
              id={`card_${tree.id}`}
              className={classes.card}
              elevation={tree.placeholder ? 0 : 3}
            >
              <CardContent className={classes.cardContent}>
                {tree.imageUrl && <CardMedia className={classes.cardMedia} image={tree.imageUrl} />}
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Grid
                  justify='flex-end'
                  container>
                  <Grid item>
                    <Person
                      color='primary'
                      onClick={e => handlePlanterDetail(e, tree)}
                    />
                    <Image
                      color='primary'
                      onClick={e => handleDialog(e, tree)}
                    />
                    <TreePin
                      width='25px'
                      height='25px'
                      title={`Open Webmap for Tree# ${tree.id}`}
                      onClick={e => {
                        handleTreePinClick(e, tree.id);
                      }}
                    />
                  </Grid>
                </Grid>
              </CardActions>
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
      rowsPerPageOptions={[12, 24, 48, 96]}
      component="div"
      count={props.verityState.treeCount || 0}
      rowsPerPage={props.verityState.pageSize}
      page={props.verityState.currentPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Images per page:"
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
                <IconButton onClick={handleFilterClick} key={1}>
                  <IconFilter />
                </IconButton>
              ]}
            >
              {isFilterShown &&
                <FilterTop
                  isOpen={isFilterShown}
                  onSubmit={filter => {
                    props.verityDispatch.updateFilter(filter);
                  }}
                  filter={props.verityState.filter}
                  onClose={handleFilterClick}
                />
              }
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
                  justify='space-between'
                  alignItems='center'
                  className={classes.title}
                >
                  <Grid item>
                    <Typography variant='h5'>
                      <ToVerifyCounter needsRefresh={props.verityState.invalidateTreeCount}
                        fetch={props.verityDispatch.getTreeCount}
                        data={props.verityState.treeCount}/>
                    </Typography>
                  </Grid>
                  <Grid item>
                    {imagePagination}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                style={{
                  width: '100%'
                }}
              >
                <Grid container className={classes.wrapper} spacing={1}>{treeImageItems}</Grid>
              </Grid>
              <Grid item container justify='flex-end' className={classes.title}>
                {imagePagination}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <SidePanel
          onSubmit={handleSubmit}
        />
      </Grid>
      {props.verityState.isApproveAllProcessing && (
        <AppBar
          position='fixed'
          style={{
            zIndex: 10000
          }}
        >
          <LinearProgress
            color='primary'
            variant='determinate'
            value={complete}
          />
        </AppBar>
      )}
      {props.verityState.isApproveAllProcessing && (
        <Modal open={true}>
          <div></div>
        </Modal>
      )}
      {false /* close undo */ && !props.verityState.isApproveAllProcessing && !props.verityState.isRejectAllProcessing &&
        props.verityState.treeImagesUndo.length > 0 && (
          <Snackbar
            open
            autoHideDuration={15000}
            ContentProps={{
              className: classes.snackbarContent,
              'aria-describedby': 'snackbar-fab-message-id'
            }}
            message={
              <span id='snackbar-fab-message-id'>
                You have {props.verityState.isBulkApproving ? ' approved ' : ' rejected '}
                {props.verityState.treeImagesUndo.length}{' '}
                trees
              </span>
            }
            color='primary'
            action={
              <Button
                color='inherit'
                size='small'
                onClick={async () => {
                  await props.verityDispatch.undoAll();
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
        onClose={() => handlePlanterDetailClose()}
      />
      <TreeDetailDialog
        open={dialog.isOpen}
        TransitionComponent={Transition}
        onClose={handleDialogClose}
        tree={dialog.tree}
      />
    </React.Fragment>
  )
};

function SidePanel(props) {
  const classes = useStyles(props);
  const [switchApprove, handleSwitchApprove] = React.useState(0)
  const [morphology, handleMorphology] = React.useState('seedling')
  const [age, handleAge] = React.useState('new_tree')
  const [captureApprovalTag, handleCaptureApprovalTag] = React.useState('simple_leaf')
  const [rejectionReason, handleRejectionReason] = React.useState('not_tree')
  const speciesRef = React.useRef(null)

  function handleSubmit() {
    const approveAction = switchApprove === 0 ?
      {
        isApproved: true,
        morphology,
        age,
        captureApprovalTag,
      }
      :
      {
        isApproved: false,
        rejectionReason,
      }
    props.onSubmit(approveAction)
  }

  return (
    <Drawer
      variant='permanent'
      anchor='right'
      className={classes.sidePanel}
      classes={{
        paper: classes.drawerPaper
      }}
      elevation={11}
    >
      <Grid container direction={'column'} className={classes.sidePanelContainer}>
        <Grid>
          <Typography variant='h5' >Tags</Typography>
        </Grid>
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <RadioGroup value={morphology} className={classes.radioGroup}>
            <FormControlLabel
              value='seedling'
              onClick={() => handleMorphology('seedling')}
              control={<Radio />}
              label='Seedling' />
            <FormControlLabel
              value='direct_seedling'
              control={<Radio />}
              onClick={() => handleMorphology('direct_seedling')}
              label='Direct seeding' />
            <FormControlLabel
              onClick={() => handleMorphology('fmnr')}
              value='fmnr' control={<Radio />} label='Pruned/tied (FMNR)' />
          </RadioGroup>
        </Grid>
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <RadioGroup value={age} className={classes.radioGroup}>
            <FormControlLabel
              onClick={() => handleAge('new_tree')}
              value='new_tree' control={<Radio />} label='New tree(s)' />
            <FormControlLabel
              onClick={() => handleAge('over_two_years')}
              value='over_two_years' control={<Radio />} label='> 2 years old' />
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
          <Typography variant='h6'>Species (if known)</Typography>
          <Species
            ref={speciesRef}
          />
        </Grid>
        <Grid>
          <Typography variant='h6'>Additional tags</Typography>
          <TreeTags placeholder='Add other text tags' />
        </Grid>
        <Grid className={`${classes.bottomLine} ${classes.sidePanelItem}`}>
          <Tabs
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            value={switchApprove}
          >
            <Tab label='APPROVE'
              id='full-width-tab-0'
              aria-controls='full-width-tabpanel-0'
              onClick={() => handleSwitchApprove(0)}
            />
            <Tab
              label='REJECT'
              id='full-width-tab-0'
              aria-controls='full-width-tabpanel-0'
              onClick={() => handleSwitchApprove(1)}
            />
          </Tabs>
          {switchApprove === 0 &&
            <RadioGroup
              value={captureApprovalTag}
            >
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('simple_leaf')}
                value='simple_leaf' control={<Radio />} label='Simple leaf' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('complex_leaf')}
                value='complex_leaf' control={<Radio />} label='Complex leaf' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('acacia_like')}
                value='acacia_like' control={<Radio />} label='Acacia-like' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('conifer')}
                value='conifer' control={<Radio />} label='Conifer' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('fruit')}
                value='fruit' control={<Radio />} label='Fruit' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('mangrove')}
                value='mangrove' control={<Radio />} label='Mangrove' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('palm')}
                value='palm' control={<Radio />} label='Palm' />
              <FormControlLabel
                onClick={() => handleCaptureApprovalTag('timber')}
                value='timber' control={<Radio />} label='Timber' />
            </RadioGroup>
          }
          {switchApprove === 1 &&
            <RadioGroup
              value={rejectionReason}
            >
              <FormControlLabel
                onClick={() => handleRejectionReason('not_tree')}
                value='not_tree' control={<Radio />} label='Not a tree' />
              <FormControlLabel
                onClick={() => handleRejectionReason('unapproved_tree')}
                value='unapproved_tree' control={<Radio />} label='Not an approved tree' />
              <FormControlLabel
                onClick={() => handleRejectionReason('blurry_image')}
                value='blurry_image' control={<Radio />} label='Blurry photo' />
              <FormControlLabel
                onClick={() => handleRejectionReason('dead')}
                value='dead' control={<Radio />} label='Dead' />
              <FormControlLabel
                onClick={() => handleRejectionReason('duplicate_image')}
                value='duplicate_image' control={<Radio />} label='Duplicate photo' />
              <FormControlLabel
                onClick={() => handleRejectionReason('flag_user')}
                value='flag_user' control={<Radio />} label='Flag user!' />
              <FormControlLabel
                onClick={() => handleRejectionReason('needs_contact_or_review')}
                value='needs_contact_or_review' control={<Radio />} label='Flag tree for contact/review' />
            </RadioGroup>
          }

        </Grid>
        {/*Hidden until functionality is implemented. Issuer: https://github.com/Greenstand/treetracker-admin/issues/371*/}
        {false && <Grid className={`${classes.sidePanelItem}`}>
          <TextField placeholder='Note (optional)' ></TextField>
        </Grid>}
        <Grid className={`${classes.sidePanelItem}`}>
          <Button onClick={handleSubmit} color='primary' >SUBMIT</Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}


export default connect(
  //state
  state => ({
    verityState: state.verity,
    speciesState: state.species,
    plantersState: state.planters,
    tagState: state.tags,
  }),
  //dispatch
  dispatch => ({
    verityDispatch: dispatch.verity,
    speciesDispatch: dispatch.species,
    plantersDispatch: dispatch.planters,
    tagDispatch: dispatch.tags,
  })
)(TreeImageScrubber);
