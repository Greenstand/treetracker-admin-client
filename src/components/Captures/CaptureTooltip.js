import React from 'react';
import OptimizedImage from '../OptimizedImage';

const CaptureTooltip = ({ capture, toggleDrawer }) => {
  return (
    <>
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
    </>
  );
};

export default CaptureTooltip;
