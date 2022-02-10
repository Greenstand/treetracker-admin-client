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
  const {
    captureImages,
    currentPage,
    loading,
    candidateImgData,
    noOfPages,
    imgCount,
    treesCount,
    handleChange,
    sameTreeHandler,
    handleSkip,
  } = useContext(CaptureMatchingContext);

  const treeIcon = <NatureOutlinedIcon className={classes.candidateImgIcon} />;

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
