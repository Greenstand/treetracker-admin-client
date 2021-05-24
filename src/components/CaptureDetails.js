import React from 'react';

const CaptureDetails = (props) => {
  let { capture } = props;
  const captureImage =
    capture.imageUrl !== null ? (
      <img
        className="capture-image"
        src={capture.imageUrl}
        alt={`capture ${capture.id}`}
      />
    ) : null;
  const isAlive = capture.causeOfDeathId !== null ? 'Dead' : 'Alive';
  const captureMissing = capture.missing ? 'True' : 'False';
  return (
    <div className="capture-panel">
      {captureImage}
      <p className="capture-location">
        Location: {capture.lat} {capture.lon}
      </p>
      <p className="capture-dead">Status: {isAlive}</p>
      <p className="capture-missing">Missing: {captureMissing}</p>
    </div>
  );
};

export default CaptureDetails;
