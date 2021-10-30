import React from 'react';

import { Typography, Box } from '@material-ui/core';

function Grower({ planter_photo_url, planter_username, status }) {
  return (
    <Box style={{ display: 'flex' }}>
      <img
        src={planter_photo_url}
        alt=""
        style={{ borderRadius: '50%', width: '130px', height: '130px' }}
      />
      <Box style={{ margin: 'auto', paddingLeft: '10px' }}>
        <Typography variant="body1" style={{ display: 'block' }}>
          {planter_username}
        </Typography>
        <Typography variant="body1">{status}</Typography>
      </Box>
    </Box>
  );
}

export default Grower;
