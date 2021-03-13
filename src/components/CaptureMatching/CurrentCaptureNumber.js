import React, { useState } from 'react';

import { Paper, Typography, Box, Icon } from '@material-ui/core';

function CurrentCaptureNumber(props) {
  const [treeCount, setTreeCount] = useState(null);

  return (
    <Box>
      <Paper elevation={2} style={{ width: '160px' }}>
        <Box p={1} style={{ display: 'flex' }}>
          <Box style={{ color: '#666', padding: '5px' }}>
            {props.cameraImg}
            {props.treeIcon}
          </Box>
          <Typography
            variant="p"
            width="65%"
            style={{ fontSize: '14px', padding: '4px' }}
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
