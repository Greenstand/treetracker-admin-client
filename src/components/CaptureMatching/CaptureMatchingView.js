import React, { useState, useEffect } from 'react';
import api from '../../api/treeTrackerApi';

import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';

import { makeStyles } from '@material-ui/core/styles';
import {
  Select,
  Button,
  AppBar,
  Divider,
  Grid,
  Box,
  Paper,
  LinearProgress,
  Drawer,
  Typography,
  FormControl,
  TextField,
  InputLabel,
} from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import { documentTitle } from '../../common/variables';
import CloseIcon from '@material-ui/icons/Close';
import { AppContext } from '../../context/AppContext';
import { MatchingToolContext } from '../../context/MatchingToolContext';
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
}));

// Set API as a variable
const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

function CaptureMatchingView(props) {
  const classes = useStyle();
  const appContext = React.useContext(AppContext);
  const matchingToolContext = React.useContext(MatchingToolContext);
  log.warn('appContext', appContext);
  log.warn('props:', props);
  log.warn('matchingToolContext:', matchingToolContext);
  const [captureImages, setCaptureImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [candidateImgData, setCandidateImgData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(null); //for pagination
  const [imgCount, setImgCount] = useState(null); //for header icon
  const [treesCount, setTreesCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // To get total tree count on candidate capture image icon
  // const treesCount = candidateImgData.length;
  const treeIcon = <NatureOutlinedIcon className={classes.candidateImgIcon} />;

  async function fetchCandidateTrees(captureId, abortController) {
    const data = await api.fetchCandidateTrees(captureId, abortController);
    if (data) {
      setCandidateImgData(data.matches);
      setTreesCount(data.matches.length);
      setLoading(false);
    }
  }

  async function fetchCaptures(currentPage, abortController) {
    log.warn('fetchCaptures:', currentPage);
    setLoading(true);
    const filter = {
      captured_at_start_date: startDate,
      captured_at_end_date: endDate,
    };
    const data = await api.fetchCapturesToMatch(
      currentPage,
      abortController,
      filter
    );
    console.log('fetchCaptures', currentPage, data);
    if (data) {
      setCaptureImages(data.captures);
      setNoOfPages(data.count);
      setImgCount(data.count);
    }
  }

  useEffect(() => {
    console.log('loading captures', currentPage);
    const abortController = new AbortController();
    fetchCaptures(currentPage, abortController);
    return () => abortController.abort();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage <= 0 || currentPage > noOfPages) {
      setCurrentPage(1);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => {
    const abortController = new AbortController();
    if (captureImages.length) {
      console.log('loading candidate images');
      const captureId = captureImages[0].id;
      console.log('captureId', captureId);
      fetchCandidateTrees(captureId, abortController);
    }
    return () => abortController.abort();
  }, [captureImages]);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // Same Tree Capture function
  const sameTreeHandler = async (treeId) => {
    const captureId = captureImages[0].id;
    console.log('captureId treeId', captureId, treeId);
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

  /* to update html document title */
  useEffect(() => {
    document.title = `Capture Matching - ${documentTitle}`;
  }, []);

  function handleStartDateChange(e) {
    setStartDate(e.target.value);
  }

  function handleEndDateChange(e) {
    setEndDate(e.target.value);
  }

  function handleFilterSubmit() {
    fetchCaptures(currentPage);
  }

  function handleFilterReset() {}

  return (
    <>
      <Grid
        container
        direction="column"
        style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
      >
        <Navbar />
        <Box className={classes.container}>
          <Paper elevation={8} className={classes.box1}>
            <CaptureImage
              captureImages={captureImages}
              currentPage={currentPage}
              loading={loading}
              noOfPages={noOfPages}
              handleChange={handleChange}
              captureApiFetch={CAPTURE_API}
              imgPerPage={1}
              imgCount={imgCount}
              handleSkip={handleSkip}
            />
          </Paper>
          <Box className={classes.box2}>
            <Box className={classes.candidateIconBox}>
              <CurrentCaptureNumber
                text={`Candidate Match${(treesCount !== 1 && 'es') || ''}`}
                treeIcon={treeIcon}
                treesCount={treesCount}
                toolTipText={`Any tree within 6m of the capture`}
              />
            </Box>
            <Box height={14} />
            {loading ? null : (
              <CandidateImages
                capture={captureImages && captureImages[0]}
                candidateImgData={candidateImgData}
                sameTreeHandler={sameTreeHandler}
              />
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
        BackdropProps={{ invisible: true }}
        open={matchingToolContext.isFilterOpen}
      >
        <Grid
          container
          direction="column"
          className={classes.customTableFilterForm}
        >
          {/* start  filter header */}
          <Grid item className={classes.customTableFilterHeader}>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Grid container direction="row">
                  <Typography variant="h6">Filter</Typography>
                </Grid>
              </Grid>
              <CloseIcon
                onClick={() => {}}
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
            <InputLabel id="sub_organization">Organization</InputLabel>
            <Select
              labelId="sub_organization"
              defaultValue={''}
              id="sub_organization"
              name="sub_organization"
              label="Organization"
              onChange={() => {}}
            >
              {/* {appContext.orgList.map((org) => (
                  <MenuItem key={org.stakeholder_uuid} value={org.stakeholder_uuid}>
                    {org.name}
                  </MenuItem>
                ))} */}
            </Select>
          </FormControl>

          <Divider style={{ margin: '50px 0 20px 0' }} />

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
    </>
  );
}

export default CaptureMatchingView;
