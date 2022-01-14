import React, { useEffect, useState, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'; // replace with icons down the line
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import TablePagination from '@material-ui/core/TablePagination';

import { LocationOn } from '@material-ui/icons';
import TableChartIcon from '@material-ui/icons/TableChart';
import CaptureImageCard from './CaptureImageCard';
import SidePanel from './../SidePanel';
import { countToLocaleString } from '../../common/numbers';
import {
  selectedHighlightColor,
  SIDE_PANEL_WIDTH,
} from '../../common/variables.js';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import { TagsContext } from '../../context/TagsContext';

const log = require('loglevel').getLogger('../components/Verify');

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 8, 4, 8),
  },
  cornerTable: {
    margin: theme.spacing(1),
    '&>*': {
      display: 'inline-flex',
      margin: theme.spacing(1, 1),
    },
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
    width: `calc(100% - ${SIDE_PANEL_WIDTH}px)`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
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

const CaptureGallery = ({
  setShowGallery,
  handleShowCaptureDetail,
  handleShowGrowerDetail,
}) => {
  const {
    capturesSelected,
    capturesUndo,
    isLoading,
    isApproveAllProcessing,
    isBulkApproving,
    rowsPerPage,
    page,
    captures,
    captureCount,
    approveAllComplete,
    approveAll,
    clickCapture,
    setPage,
    setRowsPerPage,
    undoAll,
  } = useContext(CapturesContext);

  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const classes = useStyles();
  const [complete, setComplete] = useState(0);

  // const [isLoading, setIsLoading] = useState(false);
  const refContainer = useRef();

  /* to display progress */
  useEffect(() => {
    // console.log('-- approve all complete');
    setComplete(approveAllComplete);
  }, [approveAllComplete]);

  function handleCaptureClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture:%d', captureId);
    clickCapture({
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
    if (capturesSelected.length === 0) {
      window.alert('Please select one or more captures');
      return;
    }
    const speciesId = await speciesContext.getSpeciesId();
    if (speciesId) {
      approveAction.speciesId = speciesId;
      console.log('species id:', speciesId);
    }

    //create/retrieve tags
    approveAction.tags = await tagsContext.createTags();
    const result = await approveAll(approveAction);
    if (!result) {
      window.alert('Failed to approve a capture');
    } else if (!approveAction.rememberSelection) {
      resetApprovalFields();
    }
  }

  function handleChangeRowsPerPage(event) {
    setPage(0);
    setRowsPerPage(event.target.value);
  }

  function handleChangePage(event, page) {
    setPage(page);
  }

  function isCaptureSelected(id) {
    return capturesSelected?.indexOf(id) >= 0;
  }

  const placeholderImages = isLoading
    ? Array(Math.max(rowsPerPage - captures.length, 0))
        .fill()
        .map((_, index) => {
          return {
            id: index,
            placeholder: true,
          };
        })
    : [];

  const captureImageItems = captures
    .concat(placeholderImages)
    .map((capture) => {
      return (
        <CaptureImageCard
          key={capture.id}
          capture={capture}
          isCaptureSelected={isCaptureSelected}
          handleCaptureClick={handleCaptureClick}
          handleShowGrowerDetail={handleShowGrowerDetail}
          handleShowCaptureDetail={handleShowCaptureDetail}
          handleCapturePinClick={handleCapturePinClick}
          handleGrowerMapClick={handleGrowerMapClick}
        />
      );
    });

  let imagePagination = (
    <TablePagination
      rowsPerPageOptions={[24, 96, 192, 384]}
      component="div"
      count={captureCount || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelRowsPerPage="Captures per page:"
    />
  );

  return (
    <>
      <Grid item className={classes.body}>
        <Grid item className={classes.bodyInner}>
          <Grid container>
            <Grid
              item
              // ref={{ refContainer }}
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
                    onClick={() => setShowGallery(false)}
                    startIcon={<TableChartIcon />}
                  >
                    Table View
                  </Button>
                  {imagePagination}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
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
        submitEnabled={captures.length > 0}
        variant="persistent"
      />
      {isApproveAllProcessing && (
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
      {isApproveAllProcessing && (
        <Modal open={true}>
          <div>isApproveAllProcessing is true</div>
        </Modal>
      )}
      {false && !isApproveAllProcessing && capturesUndo.length > 0 && (
        <Snackbar
          open
          autoHideDuration={15000}
          ContentProps={{
            className: classes.snackbarContent,
            'aria-describedby': 'snackbar-fab-message-id',
          }}
          message={
            <span id="snackbar-fab-message-id">
              You have {isBulkApproving === true ? ' approved ' : ' rejected '}
              {capturesUndo.length} captures
            </span>
          }
          color="primary"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={async () => {
                await undoAll();
                log.log('finished');
              }}
            >
              Undo
            </Button>
          }
          className={classes.snackbar}
        />
      )}
    </>
  );
};

export default CaptureGallery;
