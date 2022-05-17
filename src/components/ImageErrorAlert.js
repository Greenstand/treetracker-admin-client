import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

function ImageErrorAlert({
  alertHeight,
  alertWidth,
  alertPadding,
  alertPosition,
  alertTextSize,
  alertTitleSize,
}) {
  return (
    <Alert
      severity="error"
      style={{
        flexDirection: 'column',
        position: alertPosition,
        width: alertWidth,
        height: alertHeight,
        padding: alertPadding,
      }}
    >
      <AlertTitle style={{ fontSize: alertTitleSize, whiteSpace: 'nowrap' }}>
        Failed to load image
      </AlertTitle>
      <div>
        <p style={{ fontSize: alertTextSize }}>
          please try — <strong>reloading the page</strong>
        </p>

        <p style={{ fontSize: alertTextSize }}>
          or — <strong>report the issue to an admin</strong>
        </p>
      </div>
    </Alert>
  );
}

export default ImageErrorAlert;
