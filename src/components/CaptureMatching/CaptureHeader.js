import React, { useState, useEffect } from 'react';

import CurrentCaptureNumber from './CurrentCaptureNumber';

import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Backdrop,
} from '@material-ui/core';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  containerBox: {
    margin: '10px',
    padding: '10px',
  },
  captureImgIcon: {
    fontSize: '37px',
  },
});

function CaptureHeader(props) {
  const classes = useStyles();

  const {
    currentPage,
    handleChange,
    imgCount,
    imageData,
    handleSkip,
    noOfPages,
  } = props;

  const iconImgLogo = (
    <PhotoCameraOutlinedIcon className={classes.captureImgIcon} />
  );

  return (
    <Box style={{ margin: '20px' }}>
      <Box>
        <Grid
          container
          direction="row"
          // justify="space-around"
          justify="space-between"
          alignItems="baseline"
        >
          <Box
            style={
              {
                // paddingTop: '15px',
                // marginLeft: '-22px'
              }
            }
          >
            <CurrentCaptureNumber
              text="Unmatched Captures"
              // style={{paddingTop: '10px'}}
              cameraImg={iconImgLogo}
              imgCount={imgCount}
              // className={classes.headerIconBox}
            />
          </Box>

          <Box style={{ display: 'flex', flexDirection: 'wrap' }}>
            <Button
              variant="contained"
              style={{
                height: '30px',
                margin: '0 20px 0 20px',
                textTransform: 'capitalize',
                borderRadius: '15px',
              }}
            >
              My Organizations
            </Button>

            {/* <FilterListIcon style={{
                    color: "#666",
                    fontSize: "40",
                    margin: "0 20px 0 20px;"
                    }}
                /> */}

            <Pagination
              count={noOfPages}
              page={currentPage}
              onChange={handleChange}
              defaultPage={1}
              color="#666"
              size="small"
              siblingCount={0}
            />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

export default CaptureHeader;
