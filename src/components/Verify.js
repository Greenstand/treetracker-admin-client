import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  Button, // replace with icons down the line
  Grid,
  LinearProgress,
  IconButton,
  Snackbar,
  Avatar,
  Paper,
  Box,
  TablePagination,
  Divider,
  AppBar,
} from '@material-ui/core';
import { Skeleton, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import IconFilter from '@material-ui/icons/FilterList';
import CheckIcon from '@material-ui/icons/Check';
import { LocationOn, Person, Nature, Map, Image } from '@material-ui/icons';
import Navbar from './Navbar';
import GrowerDetail from './GrowerDetail';
import api from '../api/growers';
// import CaptureTags from './CaptureTags';
import SidePanel from './SidePanel';
import FilterTop from './FilterTop';
import CaptureDetailDialog from './CaptureDetailDialog';
import OptimizedImage from './OptimizedImage';
import CaptureDetailTooltip from './CaptureDetailTooltip';
import Spinner from './common/Spinner';
import { documentTitle } from 'common/variables';
import { countToLocaleString } from 'common/numbers';
import { VerifyContext } from 'context/VerifyContext';
import { SpeciesContext } from 'context/SpeciesContext';
import { TagsContext } from 'context/TagsContext';
import { CaptureDetailProvider } from 'context/CaptureDetailContext';
import { pathType } from './common/LinkToWebmap';

const log = require('loglevel').getLogger('components/Verify');
const EMPTY_ARRAY = new Array(16).fill();
const SIDE_PANEL_WIDTH = 315;
const absPosition = {
  position: 'absolute',
  top: 0,
};
const size = (width, height) => ({ width, height });

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 8),
    justifyContent: 'center',
  },
  appBar: {
    position: 'fixed',
    zIndex: '10000',
  },
  card: {
    position: 'relative',
    padding: 0,
    cursor: 'pointer',
    borderRadius: theme.spacing(4),
    background: 'ghostwhite',
    height: '100%',
  },
  cardPlaceholder: {
    aspectRatio: '3/4',
  },
  cardContainer: {
    position: 'relative',
    margin: theme.spacing(0.5),
    padding: theme.spacing(2),
  },
  cardHover: {
    '&:hover $cardMedia': {
      transform: 'scale(1.04)',
    },
    '&:hover $cardShade, &:hover $cardActions': {
      opacity: 1,
    },
  },
  cardCheckbox: {
    ...absPosition,
    ...size('1.5em', '1.5em'),
    margin: theme.spacing(1),
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
  },
  cardShade: {
    ...absPosition,
    ...size('100%', '100%'),
    background:
      'linear-gradient(0deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.5) 15%, rgba(0,0,0,.15) 31%, rgba(0,0,0,0) 100%);',
    opacity: 0,
    transition: 'opacity .4s',
  },
  cardIconContainer: {
    ...absPosition,
    ...size('100%', '100%'),
    display: 'grid',
    placeItems: 'center',
  },
  cardIcon: {
    ...size('50%', '50%'),
    fill: 'gainsboro',
  },
  cardSkeleton: {
    ...absPosition,
    ...size('100%', '100%'),
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
    borderRadius: theme.spacing(6),
  },
  cardMedia: {
    transform: 'scale(1.02)',
    transition: 'transform .4s',
  },
  cardActions: {
    position: 'absolute',
    bottom: theme.spacing(3),
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity .4s',
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
    ...size('100%', '100%'),
  },
  bodyInner: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  activeFilters: {
    ...size(theme.spacing(5), theme.spacing(5)),
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
      borderColor: theme.palette.stats.green,
      border: '2px solid',
    },
    '&.Mui-selected span': {
      color: theme.palette.stats.green,
    },
  },
  iconButton: {
    margin: theme.spacing(0.5),
    backgroundColor: 'transparent',
    outline: '2px solid #bbb',
    '&:hover': {
      backgroundColor: theme.palette.stats.green,
      outline: 'none',
    },
    '&:hover > span > svg': {
      fill: 'black',
    },
    '&:hover $myTooltip': {
      visibility: 'visible',
      opacity: 1,
    },
  },
  label: {
    '@media (max-width: 1070px)': {
      display: 'none',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    fontSize: '.8rem',
  },
  myTooltip: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity .4s',
    minWidth: '90px',
    color: 'white',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    fontSize: '.8rem',
    textAlign: 'center',
    padding: theme.spacing(1),
    borderRadius: '6px',
    position: 'absolute',
    zIndex: 1,
    bottom: '130%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    '&::after': {
      content: '" "',
      position: 'absolute',
      top: '100%',
      left: '50%',
      marginLeft: '-8px',
      borderWidth: '8px',
      borderStyle: 'solid',
      borderColor: 'rgba(40, 40, 40, 0.8) transparent transparent transparent',
    },
  },
}));

const Verify = (props) => {
  const verifyContext = useContext(VerifyContext);
  const speciesContext = useContext(SpeciesContext);
  const tagsContext = useContext(TagsContext);
  const classes = useStyles(props);
  const [isFilterShown, setFilterShown] = useState(false);
  const [isImagesLarge, setImagesLarge] = useState(true);
  const [captureDetail, setCaptureDetail] = useState({
    isOpen: false,
    capture: null,
  });
  const [growerDetail, setGrowerDetail] = useState({
    isOpen: false,
    growerId: '',
  });
  const captureSelected = verifyContext.getCaptureSelectedArr();
  const numFilters = verifyContext.filter.countAppliedFilters();
  const cRef = useRef([]);

  /*
   * effect to load page when mounted
   */
  useEffect(() => {
    log.debug('verify mounted:');
    // update filter right away to prevent non-Filter type objects loading
    document.title = `Verify - ${documentTitle}`;
  }, []);

  function handleCaptureClick(e, captureId) {
    log.debug('click on capture:', captureId);
    verifyContext.clickCapture({
      captureId,
      isShift: e.shiftKey,
    });
  }

  const handleCapturePinClick = (captureId) => (e) => {
    e.stopPropagation();
    log.debug('click on capture pin:', captureId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/${pathType.tree}/${captureId}`;
    window.open(url, '_blank').opener = null;
  };

  const handleGrowerMapClick = (growerId) => async (e) => {
    e.stopPropagation();
    const grower = await api.getGrower(growerId);
    log.debug('click on grower:', growerId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/${pathType.planter}/${grower.reference_id}`;
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
     * if approved, create new tags, and return all the applied tags
     */
    if (approveAction.isApproved) {
      const tags = await tagsContext
        .createTags
        //approveAction.captureApprovalTag
        ();
      approveAction.tags = tags.map((t) => t.id);
      delete approveAction.captureApprovalTag;
    }
    const result = await verifyContext.processCaptures(approveAction);

    if (result.error) {
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

  const handleImageLoaded = (idx) => () => {
    // add hover effect on card after image loaded
    cRef.current[idx].className = `${classes.cardHover}`;
  };

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

  const captureImageItems = verifyContext.captureImages.map((capture, idx) => {
    return (
      <Box key={capture.id} className={cardStyles.cardElement}>
        <Box
          className={clsx(
            classes.cardContainer,
            verifyContext.captureImagesSelected[capture.id]
              ? classes.cardSelected
              : undefined
          )}
        >
          <Box
            className={classes.cardPlaceholder}
            ref={(el) => {
              cRef.current[idx] = el;
            }}
          >
            <Card
              onClick={(e) => handleCaptureClick(e, capture.id)}
              id={`card_${capture.id}`}
              className={classes.card}
              elevation={capture.placeholder ? 0 : 3}
            >
              <Box className={classes.cardIconContainer}>
                <Image className={classes.cardIcon} />
                <Skeleton className={classes.cardSkeleton} variant="rect" />
              </Box>
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
                onImageReady={handleImageLoaded(idx)}
              />
              <Box className={classes.cardShade}></Box>
              <Paper className={classes.cardCheckbox} elevation={4}>
                {verifyContext.captureImagesSelected[capture.id] && (
                  <CheckIcon />
                )}
              </Paper>
            </Card>

            <Grid className={classes.cardActions}>
              <IconButton
                className={classes.iconButton}
                onClick={handleShowGrowerDetail(capture.grower_account_id)}
                aria-label={`Grower details`}
                name={`Grower details`}
              >
                <Person color="primary" />
                <Box className={classes.myTooltip}>Grower details</Box>
              </IconButton>

              <IconButton
                className={classes.iconButton}
                onClick={handleShowCaptureDetail(capture)}
                aria-label={`Capture details`}
                name={`Capture details`}
              >
                <Nature color="primary" />
                <Box className={classes.myTooltip}>
                  <CaptureDetailTooltip capture={capture} />
                </Box>
              </IconButton>

              <IconButton
                className={classes.iconButton}
                onClick={handleCapturePinClick(capture.reference_id)}
                aria-label={`Capture location`}
                name={`Capture location`}
              >
                <LocationOn color="primary" />
                <Box className={classes.myTooltip}>Capture location</Box>
              </IconButton>

              <IconButton
                className={classes.iconButton}
                onClick={handleGrowerMapClick(capture.grower_account_id)}
                aria-label={`Grower map`}
                name={`Grower map`}
              >
                <Map color="primary" />
                <Box className={classes.myTooltip}>Grower map</Box>
              </IconButton>
            </Grid>
          </Box>
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
                onSubmit={verifyContext.updateFilter}
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
              {verifyContext.isLoading ? <Spinner /> : captureImageItems}
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
        <AppBar className={classes.appBar}>
          <LinearProgress
            color="primary"
            variant="determinate"
            value={verifyContext.percentComplete}
          />
        </AppBar>
      )}

      {false /* disabled until we can delete approved captures and prevent updating previously updated records */ &&
        !verifyContext.isLoading &&
        verifyContext.isProcessing &&
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
          captureId={captureDetail.capture}
          page={'VERIFY'}
        />
      </CaptureDetailProvider>
    </>
  );
};

export default Verify;
