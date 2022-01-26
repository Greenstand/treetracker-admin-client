import React from 'react';

import CurrentCaptureNumber from './CurrentCaptureNumber';

import { Box, Grid } from '@material-ui/core';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((t) => ({
  containerBox: {
    margin: '10px',
    padding: '10px',
  },
  captureImgIcon: {
    fontSize: '37px',
  },
  box1: {
    display: 'flex',
    direction: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box3: {
    marginRight: t.spacing(2),
    display: 'flex',
    gap: '4px',
  },
  class1: {
    marginRight: t.spacing(2),
  },
}));

function CaptureHeader(props) {
  const classes = useStyles();

  const { currentPage, handleChange, imgCount, noOfPages } = props;

  const iconImgLogo = (
    <PhotoCameraOutlinedIcon className={classes.captureImgIcon} />
  );

  return (
    <Box style={{ margin: '20px' }}>
      <Box>
        <Grid container className={classes.box1}>
          <CurrentCaptureNumber
            text={`Unmatched Capture${(imgCount !== 1 && 's') || ''}`}
            cameraImg={iconImgLogo}
            imgCount={imgCount}
          />
          <Box className={classes.box2}>
            <Box className={classes.box3}>
              <Chip
                onDelete={() => console.warn('delete')}
                label={'My Organization'}
              />
              <Chip onDelete={() => console.warn('delete')} label={'Mongo'} />
            </Box>
            <FilterListIcon htmlColor="#6E6E6E" className={classes.class1} />
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
