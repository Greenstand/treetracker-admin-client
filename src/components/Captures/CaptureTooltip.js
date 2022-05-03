import React from 'react';
import OptimizedImage from '../OptimizedImage';
import {
  Box
} from '@material-ui/core';
const CaptureTooltip = ({ capture, toggleDrawer }) => {
  return (
    <Box>
      <OptimizedImage
        onClick={toggleDrawer(capture.id)}
        src={capture.imageUrl}
        style={{
          height: '160px',
          width: '160px',
          border: '2px solid black',
          borderRadius: '8px',
        }}
      />
    </Box>
  );
};

export default CaptureTooltip;
