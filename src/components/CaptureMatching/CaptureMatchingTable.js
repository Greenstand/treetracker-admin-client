import React, { useContext } from 'react';
import CaptureImage from './CaptureImage';
import CurrentCaptureNumber from './CurrentCaptureNumber';
import CandidateImages from './CandidateImages';
import Navbar from '../Navbar';
import { CaptureMatchingContext } from 'context/CaptureMatchingContext';
import { AppBar, Box, Paper, LinearProgress } from '@material-ui/core';
import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';

const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

export default function CaptureMatichingTable(props) {
  const { classes } = props;
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
    <>
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
    </>
  );
}
