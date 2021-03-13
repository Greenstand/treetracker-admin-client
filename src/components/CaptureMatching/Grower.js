import React from 'react';

import { Button, Typography, Box } from '@material-ui/core';

function Grower(props) {
  return (
    <Box style={{ display: 'flex' }}>
      <img
        src={props.userPhotoUrl}
        alt=""
        style={{ borderRadius: '50%', width: '130px', height: '130px' }}
      />
      <Box style={{ margin: 'auto', paddingLeft: '10px' }}>
        <Typography variant="p" style={{ display: 'block' }}>
          Grower Name
        </Typography>
        <Typography variant="p">grower status </Typography>
      </Box>
    </Box>
  );
}

export default Grower;
