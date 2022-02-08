import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/treeTrackerApi';

import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';
import CaptureMatchingProvider, {
  CaptureMatchingContext,
} from 'context/CaptureMatchingContext';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Box, Paper, LinearProgress } from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import { documentTitle } from '../../common/variables';
import Fab from '@material-ui/core/Fab';
import CaptureMatchingFilter from './CaptureMatchingFilter';

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
}));

// Set API as a variable
const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

function CaptureMatchingView() {
  const classes = useStyle();
  const { isFilterShown, handleFilterClick } = useContext(
    CaptureMatchingContext
  );
  const [captureImages, setCaptureImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [candidateImgData, setCandidateImgData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(null); //for pagination
  const [imgCount, setImgCount] = useState(null); //for header icon
  const [treesCount, setTreesCount] = useState(0);
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
    setLoading(true);
    const data = await api.fetchCapturesToMatch(currentPage, abortController);
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

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <CaptureMatchingProvider>
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
              />
            </Box>
            <Box height={14} />
            <CandidateImages
              capture={captureImages && captureImages[0]}
              candidateImgData={candidateImgData}
              sameTreeHandler={sameTreeHandler}
            />
          </Box>
        </Box>
        {loading && (
          <AppBar position="fixed" style={{ zIndex: 10000 }}>
            <LinearProgress color="primary" />
          </AppBar>
        )}
      </CaptureMatchingProvider>
    </Grid>
  );
}

export default CaptureMatchingView;
