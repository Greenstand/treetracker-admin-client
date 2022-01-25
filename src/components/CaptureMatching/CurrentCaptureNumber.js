import React from 'react';

import { Paper, Typography, Box } from '@material-ui/core';

function CurrentCaptureNumber(props) {
  return (
    <Box>
      <Paper elevation={2} style={{ width: '200px' }}>
        <Box p={1} style={{ display: 'flex' }}>
          <Box style={{ color: '#666', padding: '3px' }}>
            {props.cameraImg}
            {props.treeIcon}
          </Box>
          <Typography
            variant="h3"
            width="65%"
            style={{ fontSize: '14px', padding: '6px' }}
          >
            {props.imgCount} {props.treesCount}
            <span
              style={{
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            >
              {props.text}
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default CurrentCaptureNumber;
