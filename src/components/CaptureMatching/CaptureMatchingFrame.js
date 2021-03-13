import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CaptureHeader from './CaptureHeader';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import { useMediaQuery } from '@material-ui/core';
import theme from '../common/theme';

const useStyle = makeStyles({
  container: {
    padding: theme.spacing(5, 4, 2, 4),
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

function CaptureMachineFrame() {
  const classes = useStyle();

  const [captureImages, setCaptureImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imgPerPage, setImgPerPage] = [1];
  const [cadidateImgData, setCandidateImgData] = useState([]);

  // for set how many pages we need in total for pagination
  const [noOfPages, setNoOfPages] = useState(null);

  // for get the total imag count for header Icon
  const [imgCount, setImgCount] = useState(null);

  // To get total tree count on candidate capture image icon
  const treesCount = cadidateImgData.length;
  const treeIcon = <NatureOutlinedIcon className={classes.candidateImgIcon} />;

  // Set API as a variable
  //const captureApiFetch = 'https://jsonplaceholder.typicode.com/photos'
  const captureApiFetch =
    'https://dev-k8s.treetracker.org/treetracker/captures';
  const candidateCaptureApiFetch =
    'https://dev-k8s.treetracker.org/treetracker/captures/capture_id/potential_trees/';

  useEffect(async () => {
    await fetch(candidateCaptureApiFetch)
      .then((res) => res.json())
      .then((data) => {
        setCandidateImgData(data.trees);
        setImgCount(data.trees.tree_id);

        setLoading(false);
      });
  }, []);

  useEffect(async () => {
    await fetch(captureApiFetch)
      .then((res) => res.json())
      .then((data) => {
        setCaptureImages(data.captures);
        setNoOfPages(Math.ceil(data.captures.length / imgPerPage));
        setImgCount(data.captures.capture_Id);

        setLoading(false);
      });
  }, []);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // //Same Tree Capture function
  const sameTreeHandler = (id, i) => {
    // const newImgData = captureImages.splice(id, captureImages.length -1 )
    const newImgData = captureImages.splice(id, captureImages.length - 1);
    setCaptureImages(newImgData);
    console.log('removed');
  };

  //   const sameTreeHandler = (e) => {

  //     const newImgData = captureImages.filter => {
  //       console.log(currentImg)
  //       // return  currentImg.id !== e.tree_id

  //     })

  // }

  // Skip button
  const handleSkip = () => {
    const skip = currentPage + imgPerPage;
    setCurrentPage(skip);
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
            captureApiFetch={captureApiFetch}
            imgPerPage={imgPerPage}
            imgCount={imgCount}
            handleSkip={handleSkip}
          />

          <Box style={{ width: '50%' }}>
            <Box p={2} className={classes.candidateIconBox}>
              <CurrentCaptureNumber
                text="Candidate Match"
                treeIcon={treeIcon}
                treesCount={treesCount}
              />
            </Box>
            <CandidateImages
              cadidateImgData={cadidateImgData}
              sameTreeHandler={() => sameTreeHandler()}
              captureImages={captureImages}
            />
          </Box>
        </Grid>
      </Box>
    </>
  );
}

export default CaptureMachineFrame;
