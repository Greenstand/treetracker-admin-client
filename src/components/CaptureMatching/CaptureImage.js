import React from 'react';

import CaptureHeader from './CaptureHeader';
import Grower from './Grower';
import theme from '../common/theme';

import { Typography, Box, Button, Grid } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  containerBox: {
    margin: theme.spacing(5),
    paddingTop: '30px',
    background: '#fff',
    borderRadius: '4px',
  },

  headerBox: {
    display: 'flex',
    flexDirection: 'spaceBetween',
  },

  imgContainer: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    marginTop: '20px',
  },
});

function CaptureImage(props) {
  const {
    captureImages,
    currentPage,
    noOfPages,
    handleChange,
    imgPerPage,
    imgCount,
    handleSkip,
  } = props;

  const classes = useStyles();

  return (
    <Box style={{ width: '50%' }}>
      <CaptureHeader
        currentPage={currentPage}
        handleChange={handleChange}
        imgCount={imgCount}
        handleSkip={handleSkip}
        noOfPages={noOfPages}
        captureImages={captureImages}
      />

      {captureImages
        .slice((currentPage - 1) * imgPerPage, currentPage * imgPerPage)
        .map((capture) => {
          return (
            <Box
              key={`capture_${capture.captureId}`}
              className={classes.containerBox}
            >
              <Box className={classes.headerBox}>
                <Grid
                  container
                  direction="row"
                  justify="space-around"
                  // alignItems="baseline"
                >
                  <Box style={{ marginTop: '15px' }}>
                    <Typography
                      variant="h5"
                      style={{ width: '150px', wordWrap: 'break-word' }}
                    >
                      Capture {capture.captureId}
                    </Typography>
                    <Box display="flex">
                      <AccessTimeIcon />
                      <Typography variant="body1">
                        {capture.createdAt}
                      </Typography>
                    </Box>

                    <Box display="flex">
                      <LocationOnOutlinedIcon />
                      <Typography variant="body1">USA</Typography>
                    </Box>
                    {/* <UseLoocation/> */}
                  </Box>

                  <Grower userPhotoUrl={capture.userPhotoUrl} />

                  <Button
                    variant="outlined"
                    color="primary"
                    style={{
                      height: '50px',
                      width: '100px',
                      marginTop: '10px',
                    }}
                    onClick={handleSkip}
                  >
                    Skip
                    <SkipNextIcon />
                  </Button>
                </Grid>
              </Box>

              <Box className={classes.imgBox}>
                {/* {treeList.slice(0, 1).map( img => { */}

                <img
                  key={capture.captureId}
                  className={classes.imgContainer}
                  src={capture.imageUrl}
                  alt={`Capture ${capture.captureId}`}
                />
              </Box>
            </Box>
          );
        })}
    </Box>
  );
}

export default CaptureImage;
