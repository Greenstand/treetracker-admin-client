import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  box1: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
  },
  box2: {},
}));
function Grower({ planter_photo_url, planter_username, status }) {
  const classes = useStyles();
  return (
    <Box className={classes.box1}>
      <Avatar className={classes.avatar} src={planter_photo_url} />
      <Box className={classes.box2}>
        <Typography variant="h5">{planter_username}</Typography>
        <Typography variant="body1">{/*status*/ 'Other info'}</Typography>
      </Box>
    </Box>
  );
}

export default Grower;
