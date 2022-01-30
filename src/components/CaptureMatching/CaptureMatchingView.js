import React, { useState, useEffect } from 'react';

import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Paper } from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import { documentTitle } from '../../common/variables';

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

  async function fetchCandidateTrees(captureId) {
    // TODO: handle errors and give user feedback
    setLoading(true);
    const data = await fetch(
      `${CAPTURE_API}/trees/potential_matches?capture_id=${captureId}`,
      {
        headers: {
          // Authorization: session.token,
        },
      }
    ).then((res) => res.json());
    setCandidateImgData(data.matches);
    setTreesCount(data.matches.length);
    setLoading(false);
  }

  async function fetchCaptures(currentPage) {
    // TODO: handle errors and give user feedback
    setLoading(true);
    const data = await fetch(
      `${CAPTURE_API}/captures?limit=${1}&offset=${currentPage - 1}`,
      {
        headers: {
          // Authorization: session.token,
        },
      }
    ).then((res) => res.json());
    setCaptureImages(data.captures);
    setNoOfPages(data.count);
    setImgCount(data.count);
    setLoading(false);
  }

  useEffect(() => {
    console.log('loading captures', currentPage);
    fetchCaptures(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage <= 0 || currentPage > noOfPages) {
      setCurrentPage(1);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => {
    if (captureImages.length) {
      console.log('loading candidate images');
      const captureId = captureImages[0].id;
      console.log('captureId', captureId);
      fetchCandidateTrees(captureId);
    }
  }, [captureImages]);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // Same Tree Capture function
  const sameTreeHandler = (treeId) => {
    // TODO: handle errors and give user feedback
    const captureId = captureImages[currentPage - 1].id;
    console.log('captureId treeId', captureId, treeId);
    fetch(`${CAPTURE_API}/captures/${captureId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        // Authorization: session.token,
      },
      body: JSON.stringify({
        tree_id: treeId,
      }),
    });

    const newImgData = [
      ...captureImages.slice(0, currentPage - 1, 1),
      ...captureImages.slice(currentPage, captureImages.length),
    ];
    setCaptureImages(newImgData);
  };

  // Skip button
  const handleSkip = () => {
    setCurrentPage(currentPage + 1);
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
            candidateImgData={candidateImgData}
            sameTreeHandler={sameTreeHandler}
          />
        </Box>
      </Box>
    </Grid>
  );
}

export default CaptureMatchingView;
