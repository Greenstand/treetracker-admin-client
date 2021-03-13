import React, { useState } from 'react';
import posed from 'react-pose';

function Zoom() {
  const [isZoomed, setIsZoomed] = useState(false);

  const zoomInHandlert = () => {
    setIsZoomed(true);
  };

  const zoomOutHandlert = () => {
    setIsZoomed(false);
  };

  return (
    <div>
      <div
        onClick={() => (isZoomed ? zoomOutHandler() : this.zoomInHandler())}
        style={{ width: '80%', height: '100%' }}
      ></div>
    </div>
  );
}

export default Zoom;
