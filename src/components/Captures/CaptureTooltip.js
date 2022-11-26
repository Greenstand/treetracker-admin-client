import React, { useState } from 'react';
import OptimizedImage from '../OptimizedImage';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
}));

const CaptureTooltip = ({ capture, toggleDrawer }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const classes = useStyles();
  return (
    <Box>
      {isImageLoading && (
        <Box className={classes.spinner}>
          <CircularProgress />
        </Box>
      )}
      <OptimizedImage
        onClick={toggleDrawer(capture.id)}
        src={capture.image_url}
        width={160}
        height={160}
        style={{
          height: '160px',
          width: '160px',
          border: '2px solid black',
          borderRadius: '8px',
        }}
        onImageReady={() => {
          setIsImageLoading(false);
        }}
      />
    </Box>
  );
};

export default CaptureTooltip;
