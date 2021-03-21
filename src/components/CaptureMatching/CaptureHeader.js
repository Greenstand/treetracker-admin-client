import React from 'react';

import CurrentCaptureNumber from './CurrentCaptureNumber';

import { Box, Button, Grid } from '@material-ui/core';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
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

  const { currentPage, handleChange, imgCount, noOfPages } = props;

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
          <Box>
            <CurrentCaptureNumber
              text={`Unmatched Capture${imgCount !== 1 && 's'}`}
              cameraImg={iconImgLogo}
              imgCount={imgCount}
            />
          </Box>

          <Box style={{ display: 'flex', flexDirection: 'wrap' }}>
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
}

export default CaptureHeader;
