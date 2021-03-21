import React, { useState, useEffect } from 'react';

import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import theme from '../common/theme';

const useStyle = makeStyles({
  container: {
    background: '#eee',
    width: '100%',
    height: 'auto',
    display: 'flex',
    paddingBottom: '40px',
  },

  candidateImgIcon: {
    fontSize: '37px',
  },

  candidateIconBox: {
    marginLeft: theme.spacing(5),
  },
});

// Set API as a variable
const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}/captures`;

function CaptureMachineFrame() {
  const classes = useStyle();

  const [captureImages, setCaptureImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cadidateImgData, setCandidateImgData] = useState([]);

  // for set how many pages we need in total for pagination
  const [noOfPages, setNoOfPages] = useState(null);

  // for get the total imag count for header Icon
  const [imgCount, setImgCount] = useState(null);

  // To get total tree count on candidate capture image icon
  const treesCount = cadidateImgData.length;
  const treeIcon = <NatureOutlinedIcon className={classes.candidateImgIcon} />;

  useEffect(() => {
    async function fetchCandidateTrees(captureId) {
      // TODO: Add authorization header
      setLoading(true);
      const data = await fetch(
        `${CAPTURE_API}/${captureId}/potential_trees`,
      ).then((res) => res.json());
      setCandidateImgData(data.trees);
      setLoading(false);
    }

    setCandidateImgData([]);

    if (currentPage > 0 && currentPage <= captureImages.length) {
      const captureId = captureImages[currentPage - 1].captureId;
      if (captureId) {
        fetchCandidateTrees(captureId);
      }
    }
  }, [currentPage, captureImages]);

  useEffect(() => {
    async function fetchCaptures() {
      // TODO: Add authorization header
      setLoading(true);
      const data = await fetch(`${CAPTURE_API}`).then((res) => res.json());
      setCaptureImages(data.captures);
      setLoading(false);
    }
    fetchCaptures();
  }, []);

  useEffect(() => {
    if (currentPage <= 0 || currentPage > noOfPages) {
      setCurrentPage(1);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => {
    setNoOfPages(captureImages.length);
    setImgCount(captureImages.length);
  }, [captureImages]);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // Same Tree Capture function
  const sameTreeHandler = (/*treeId*/) => {
    // TODO: post match to API
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

  return (
    <>
      <Navbar />
      <Box className={classes.container}>
        <Grid container direction="row">
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

          <Box style={{ width: '50%' }}>
            <Box p={2} className={classes.candidateIconBox}>
              <CurrentCaptureNumber
                text={`Candidate Match${treesCount !== 1 && 'es'}`}
                treeIcon={treeIcon}
                treesCount={treesCount}
              />
            </Box>
            <CandidateImages
              cadidateImgData={cadidateImgData}
              sameTreeHandler={sameTreeHandler}
              captureImages={captureImages}
            />
          </Box>
        </Grid>
      </Box>
    </>
  );
}

export default CaptureMachineFrame;
