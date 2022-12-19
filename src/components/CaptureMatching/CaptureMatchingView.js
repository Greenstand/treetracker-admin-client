import React, { useState, useEffect, useContext, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  AppBar,
  Chip,
  Divider,
  Grid,
  Box,
  Paper,
  LinearProgress,
  Drawer,
  Typography,
  FormControl,
  TextField,
  Avatar,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import QuestionMarkIcon from '@material-ui/icons/HelpOutlineOutlined';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import Pagination from '@material-ui/lab/Pagination';

import { documentTitle } from 'common/variables';
import { getDateTimeStringLocale } from 'common/locale';
import { AppContext } from 'context/AppContext';
import { MatchingToolContext } from 'context/MatchingToolContext';
import { CaptureDetailProvider } from 'context/CaptureDetailContext';
import { GrowerProvider } from 'context/GrowerContext';
import CaptureDetailDialog from 'components/CaptureDetailDialog';
import OptimizedImage from 'components/OptimizedImage';
import GrowerDetail from 'components/GrowerDetail';
import Country from '../common/Country';
import SelectOrg from '../common/SelectOrg';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';
import api from 'api/treeTrackerApi';
import log from 'loglevel';

const useStyle = makeStyles((theme) => ({
  container: {
    backgroundColor: '#E5E5E5',
    width: '100%',
    display: 'flex',
    height: 'calc(100vh - 43px)',
  },
  candidateImgIcon: {
    fontSize: '37px',
  },
  candidateIconBox: {},
  box1: {
    backgroundColor: '#F0F0F0',
    padding: theme.spacing(4, 4),
    width: '50%',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: '0px',
  },
  box2: {
    padding: theme.spacing(4, 4),
    width: '50%',
    overflow: 'auto',
  },
  customTableFilterHeader: {
    padding: theme.spacing(0, 0, 5, 0),
  },
  customTableFilterSubmitButton: {
    marginBottom: theme.spacing(2.5),
    color: theme.palette.stats.white,
  },
  customTableFilterResetButton: {
    border: 'none',
  },
  customTableFilterForm: {
    width: theme.spacing(80),
    padding: theme.spacing(5, 4),
  },
  customTableFilterCloseIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.lightVery,
  },
  customTableFilterAvatar: {
    backgroundColor: theme.palette.primary.lightVery,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(2),
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
  customTableFilterSelectFormControl: {
    margin: theme.spacing(2, 0, 2, 0),
    width: '100%',
  },
  // styles for export button
  csvLink: {
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'flex-end',
    textDecoration: 'none',
  },
  captureImageContainerBox: {
    background: '#fff',
    borderRadius: '4px',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    height: '1px',
  },

  captureImageHeaderBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    alignItems: 'center',
  },
  captureImageImgBox: {
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    position: 'relative',
  },
  captureImageImgContainer: {
    objectFit: 'contain',
  },
  captureImageCaptureInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  captureImageBox1: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  captureImageBox3: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: '4px',
    '& svg': {
      width: '16px',
      height: '16px',
    },
  },
  captureImageButton: {
    height: '100%',
  },
  currentNumberBox1: {
    width: 173,
    height: 50,
  },
  currentNumberBox2: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  currentNumberBox3: {
    width: 48,
    justifyContent: 'center',
    display: 'flex',
    '& svg': {
      width: 24,
      height: 24,
      fill: 'gray',
    },
  },
  currentNumberBox4: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& svg': {
      width: 18,
      height: 18,
      fill: 'gray',
      left: theme.spacing(1),
      position: 'relative',
    },
  },
  currentNumberText: {
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '14px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  currentNumberBold: {
    fontWeight: '700',
  },
  currentHeaderCaptureImgIcon: {
    fontSize: '37px',
  },
  currentHeaderBox1: {
    display: 'flex',
    direction: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentHeaderBox2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentHeaderBox3: {
    marginRight: theme.spacing(2),
    display: 'flex',
    gap: '4px',
  },
  currentHeaderClass1: {
    marginRight: theme.spacing(2),
  },
  growerBox1: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  growerAvatar: {
    width: 48,
    height: 48,
  },
  growerBox2: {},
  notesContainerBox: {
    textAlign: 'center',
  },
  notesBody: {
    marginLeft: theme.spacing(2),
    alignSelf: 'flex-end',
  },
}));

// Set API as a variable
const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

function CaptureMatchingView() {
  const initialFilter = {
    startDate: '',
    endDate: '',
    stakeholderUUID: null,
  };

  const classes = useStyle();
  const appContext = useContext(AppContext);
  const matchingToolContext = useContext(MatchingToolContext);
  const [captureImage, setCaptureImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [candidateImgData, setCandidateImgData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(null); //for pagination
  const [imgCount, setImgCount] = useState(null); //for header icon
  const [treesCount, setTreesCount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organizationId, setOrganizationId] = useState(null);
  const [stakeholderUUID, setStakeholderUUID] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [growerAccount, setGrowerAccount] = useState({});
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [isGrowerDetailsOpen, setGrowerDetailsOpen] = useState(false);
  // To get total tree count on candidate capture image icon
  // const treesCount = candidateImgData.length;

  async function fetchCandidateTrees(captureId, abortController) {
    const data = await api.fetchCandidateTrees(captureId, abortController);
    if (data) {
      setCandidateImgData(data.matches);
      setTreesCount(data.matches.length);
      setLoading(false);
    }
  }

  async function clean() {
    setCandidateImgData([]);
    setTreesCount(0);
    setCaptureImage(null);
    setTreesCount(0);
    setImgCount(null);
    // setCurrentPage(1);
    // setNoOfPages(null);
  }

  async function fetchCaptures(currentPage, abortController) {
    clean();
    setLoading(true);
    // log.debug('fetchCaptures filter', filter);
    const filterParameters = {
      captured_at_start_date: filter.startDate,
      captured_at_end_date: filter.endDate,
      'organization_ids[]': filter.stakeholderUUID && [filter.stakeholderUUID],
    };
    // log.debug('fetchCaptures filterParameters', filterParameters);
    const data = await api.fetchCapturesToMatch(
      currentPage,
      abortController,
      filterParameters
    );
    // log.debug('fetchCaptures data', currentPage, data);
    if (data?.captures?.length > 0) {
      setCaptureImage(data.captures[0]);
      setNoOfPages(data.count);
      setImgCount(data.count);
    } else {
      setLoading(false);
      setNoOfPages(0);
      setImgCount(0);
      log.warn('no data:', data);
    }
  }

  async function loadGrowerInfo() {
    if (captureImage) {
      // log.warn('loadGrowerInfo...');
      if (captureImage.grower_account_id) {
        const data = await api.getGrowerAccountById(
          captureImage.grower_account_id
        );
        setGrowerAccount(data);
      } else {
        log.warn('No grower account id found');
      }
    }
  }

  useEffect(() => {
    document.title = `Capture Matching - ${documentTitle}`;
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCaptures(currentPage, abortController);
    return () => abortController.abort();
  }, [currentPage, filter]);

  useEffect(() => {
    if (currentPage <= 0 || currentPage > noOfPages) {
      setCurrentPage(1);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => {
    const abortController = new AbortController();
    if (captureImage) {
      const captureId = captureImage.id;
      fetchCandidateTrees(captureId, abortController);
      // load grower info
      loadGrowerInfo();
    }
    return () => abortController.abort();
  }, [captureImage]);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // Same Tree Capture function
  const sameTreeHandler = async (treeId) => {
    const captureId = captureImage.id;
    // log.debug('captureId treeId', captureId, treeId);
    await fetch(`${CAPTURE_API}/captures/${captureId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        // Authorization: session.token,
      },
      body: JSON.stringify({
        tree_id: treeId,
      }),
    });

    // make sure new captures are loaded by updating page or if it's the first page reloading directly
    if (currentPage === 1) {
      fetchCaptures(currentPage);
    } else {
      setCurrentPage((page) => page + 1);
    }
  };

  // Skip button
  const handleSkip = () => {
    setCurrentPage((page) => page + 1);
  };

  function handleStartDateChange(e) {
    setStartDate(e.target.value);
  }

  function handleEndDateChange(e) {
    setEndDate(e.target.value);
  }

  function handleFilterSubmit() {
    // log.debug('filter submit -----> ', organizationId, stakeholderUUID);
    setFilter({
      startDate,
      endDate,
      stakeholderUUID,
    });
    matchingToolContext.handleFilterToggle();
  }

  function handleFilterReset() {
    setFilter(initialFilter);
    setOrganizationId(null);
    matchingToolContext.handleFilterToggle();
  }

  function toggleDrawer() {
    setIsDetailsPaneOpen(!isDetailsPaneOpen);
  }

  const closeDrawer = () => {
    setIsDetailsPaneOpen(false);
  };

  const countryInfo = useMemo(() => {
    const latitude = captureImage?.latitude || captureImage?.lat;
    const longitude = captureImage?.longitude || captureImage?.lon;

    return latitude && longitude && <Country lat={latitude} lon={longitude} />;
  }, [
    captureImage?.latitude,
    captureImage?.longitude,
    captureImage?.lat,
    captureImage?.lon,
  ]);

  const getGroverRegDate = () => {
    if (Object.keys(growerAccount).length !== 0) {
      return growerAccount.first_registration_at
        ? 'Joined at ' +
            getDateTimeStringLocale(growerAccount.first_registration_at)
        : 'Joined at ' + getDateTimeStringLocale(growerAccount.created_at);
    }
  };

  // components
  function currentCaptureNumber(text, icon, count, tooltip) {
    return (
      <Box>
        <Paper elevation={3} className={classes.currentNumberBox1}>
          <Box className={classes.currentNumberBox2}>
            <Box>
              <Box className={classes.currentNumberBox3}>{icon}</Box>
            </Box>
            <Box>
              <Box className={classes.currentNumberBox4}>
                <Typography
                  variant="h6"
                  className={`${classes.currentNumberText} ${classes.currentNumberBold}`}
                >
                  {count}
                </Typography>
                {tooltip && (
                  <Tooltip placement="right-start" title={tooltip}>
                    <QuestionMarkIcon />
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body1" className={classes.currentNumberText}>
                {text}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  const CaptureHeader = (
    <Box>
      <Box>
        <Grid container className={classes.currentHeaderBox1}>
          {currentCaptureNumber(
            `Unmatched Capture${(imgCount !== 1 && 's') || ''}`,
            <PhotoCameraOutlinedIcon
              className={classes.currentHeaderCaptureImgIcon}
            />,
            imgCount,
            ''
          )}
          <Box className={classes.currentHeaderBox2}>
            <Box>
              {(filter.startDate || filter.endDate) && (
                <Chip
                  label={`${filter.startDate || 'Start Date'} - ${
                    filter.endDate || 'End Date'
                  }`}
                  className={classes.currentHeaderChip}
                  onDelete={() =>
                    setFilter({
                      ...filter,
                      startDate: undefined,
                      endDate: undefined,
                    })
                  }
                />
              )}
              {filter.stakeholderUUID && (
                <Chip
                  label={appContext.orgList.reduce((a, c) => {
                    return c.stakeholder_uuid === filter.stakeholderUUID
                      ? c.name
                      : a;
                  }, '')}
                  className={classes.currentHeaderChip}
                  onDelete={() =>
                    setFilter({
                      ...filter,
                      stakeholderUUID: undefined,
                    })
                  }
                />
              )}
            </Box>
            <IconButton
              onClick={matchingToolContext.handleFilterToggle}
              className={classes.currentHeaderClass1}
            >
              <FilterListIcon htmlColor="#6E6E6E" />
            </IconButton>
            <Pagination
              count={noOfPages}
              page={currentPage}
              onChange={handleChange}
              defaultPage={1}
              size="small"
              siblingCount={0}
            />
          </Box>
        </Grid>
      </Box>
    </Box>
  );

  const CaptureImage = (
    <Box
      data-testid="capture-image-container"
      className={classes.captureImageBox1}
    >
      {CaptureHeader}
      <Box height={16} />
      {!loading && !captureImage && (
        //captureImage && treesCount === 0 && (
        <Box>
          <Typography variant="h5">No capture found.</Typography>
        </Box>
      )}
      {captureImage && (
        <Paper
          elevation={4}
          key={`capture_${captureImage.id}`}
          className={classes.captureImageContainerBox}
        >
          <Box
            data-testid="capture-image-header"
            className={classes.captureImageHeaderBox}
          >
            <Box className={classes.box2}>
              <Tooltip title={captureImage.reference_id} interactive>
                <Typography variant="h5">
                  Capture {captureImage.reference_id}
                </Typography>
              </Tooltip>
              <Box className={classes.captureImageCaptureInfo}>
                <Box className={classes.captureImageBox3}>
                  <AccessTimeIcon />
                  <Typography variant="body1">
                    {getDateTimeStringLocale(
                      captureImage.captured_at || captureImage.created_at
                    )}
                  </Typography>
                </Box>
                <Box className={classes.captureImageBox3}>
                  <LocationOnOutlinedIcon
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${
                          captureImage.latitude || captureImage.lat
                        },${captureImage.longitude || captureImage.lon}`
                      );
                    }}
                  />
                  {countryInfo && (
                    <Typography variant="body1">{countryInfo};</Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {!loading && growerAccount && (
              <Box
                onClick={() => setGrowerDetailsOpen(true)}
                className={classes.growerBox1}
              >
                <Avatar
                  className={classes.growerAvatar}
                  src={growerAccount.image_url}
                />
                <Box className={classes.growerBox2}>
                  <Typography variant="h5">
                    {growerAccount.first_name}
                  </Typography>
                  <Typography variant="body1">{getGroverRegDate()}</Typography>
                </Box>
              </Box>
            )}
            {loading && <Box>...</Box>}
            {!loading && !growerAccount && <Box>no grower info</Box>}

            <Button
              variant="text"
              color="primary"
              onClick={handleSkip}
              className={classes.captureImageButton}
            >
              Skip
              <SkipNextIcon />
            </Button>
          </Box>

          <Box
            data-testid="capture-image"
            className={classes.captureImageImgBox}
            onClick={toggleDrawer}
          >
            <OptimizedImage
              key={captureImage.id}
              className={classes.captureImageImgContainer}
              src={captureImage.image_url}
              alt={`Capture ${captureImage.reference_id}`}
              objectFit="contain"
              width={window.innerWidth * 0.5}
              fixed
              alertWidth="100%"
              alertHeight="30%"
              alertPadding="2rem"
              alertTitleSize="1.6rem"
              alertTextSize="1rem"
            />
          </Box>

          {captureImage.note && (
            <Box
              className={classes.notesContainerBox}
              margin={4}
              display="flex"
              justifyContent="center"
            >
              <Typography variant="h6">Notes:</Typography>
              <Typography variant="body1" className={classes.notesBody}>
                {captureImage.note}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );

  return (
    <>
      <Grid
        container
        direction="column"
        style={{
          flexWrap: 'nowrap',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Navbar />
        <Box className={classes.container}>
          <Paper elevation={8} className={classes.box1}>
            {CaptureImage}
          </Paper>
          <Box className={classes.box2}>
            <Box className={classes.candidateIconBox}>
              {currentCaptureNumber(
                `Candidate Match${(treesCount !== 1 && 'es') || ''}`,
                <NatureOutlinedIcon className={classes.candidateImgIcon} />,
                treesCount,
                `Any tree within 6m of the capture`
              )}
            </Box>
            <Box height={14} />
            {loading ? null : (
              <CandidateImages
                capture={captureImage}
                candidateImgData={candidateImgData}
                sameTreeHandler={sameTreeHandler}
              />
            )}
            {!loading &&
              captureImage &&
              candidateImgData &&
              candidateImgData.length === 0 && (
                //captureImage && treesCount === 0 && (
                <Box className={classes.noCandidateBox}>
                  <Typography variant="h5">
                    No candidate match found, this capture might be a new tree
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>
        {loading && (
          <AppBar position="fixed" style={{ zIndex: 10000 }}>
            <LinearProgress color="primary" />
          </AppBar>
        )}
      </Grid>
      <Drawer
        anchor="right"
        BackdropProps={{ invisible: false }}
        open={matchingToolContext.isFilterOpen}
        onClose={matchingToolContext.handleFilterToggle}
      >
        <Grid
          container
          direction="column"
          className={classes.customTableFilterForm}
        >
          {/* start  filter header */}
          <Grid item className={classes.customTableFilterHeader}>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Grid container direction="row">
                  <Typography variant="h6">Filter</Typography>
                </Grid>
              </Grid>
              <CloseIcon
                onClick={matchingToolContext.handleFilterToggle}
                className={classes.customTableFilterCloseIcon}
              />
            </Grid>
          </Grid>
          {/* end   filter header */}

          {/* start filter body */}

          <>
            <FormControl
              variant="outlined"
              className={classes.customTableFilterSelectFormControl}
            >
              <TextField
                id="start_date"
                name="start_date"
                value={startDate}
                label="Start Date"
                type="date"
                onChange={handleStartDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>

            <FormControl
              variant="outlined"
              className={classes.customTableFilterSelectFormControl}
            >
              <TextField
                id="end_date"
                name="end_date"
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </>
          <FormControl
            variant="outlined"
            className={classes.customTableFilterSelectFormControl}
          >
            <SelectOrg
              orgId={organizationId || 'ORGANIZATION_NOT_SET'}
              defaultOrgs={[
                {
                  id: 'ORGANIZATION_NOT_SET',
                  stakeholder_uuid: null,
                  name: 'Not set',
                  value: null,
                },
              ]}
              handleSelection={(org) => {
                setOrganizationId(org.id);
                setStakeholderUUID(org.stakeholder_uuid);
              }}
            />
          </FormControl>

          <Divider
            style={{
              margin: '50px 0 20px 0',
            }}
          />

          <Grid
            container
            direction="column"
            className={classes.customTableFilterActions}
          >
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className={classes.customTableFilterSubmitButton}
              onClick={handleFilterSubmit}
            >
              APPLY
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={handleFilterReset}
              className={classes.customTableFilterResetButton}
            >
              RESET
            </Button>
          </Grid>
        </Grid>
      </Drawer>
      <CaptureDetailProvider>
        {isDetailsPaneOpen && (
          <CaptureDetailDialog
            open={isDetailsPaneOpen}
            captureId={captureImage?.id}
            onClose={closeDrawer}
            page={'CAPTURES'}
          />
        )}
      </CaptureDetailProvider>
      <GrowerProvider>
        <GrowerDetail
          open={isGrowerDetailsOpen}
          growerId={growerAccount.growerId}
          onClose={() => setGrowerDetailsOpen(false)}
        />
      </GrowerProvider>
    </>
  );
}

export default CaptureMatchingView;
