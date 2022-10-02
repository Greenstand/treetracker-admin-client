import React, { useState } from 'react';
import OptimizedImage from '../OptimizedImage';
import { Box } from '@material-ui/core';
const CaptureTooltip = ({ capture, toggleDrawer }) => {
  const [loading, setLoading] = useState(true);

  return (
    <Box>
      <OptimizedImage
        onClick={toggleDrawer(capture.id)}
        src={capture.imageUrl}
        width={160}
        height={160}
        style={{
          height: '160px',
          width: '160px',
          border: !loading && '2px solid black',
          borderRadius: '8px',
        }}
        loadingState={loading}
        setLoadingState={setLoading}
      />
    </Box>
  );
};

export default CaptureTooltip;
