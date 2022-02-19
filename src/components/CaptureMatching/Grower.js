import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  test: {
    padding: theme.spacing(1),
  },
  box1: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  box2: {},
}));
function Grower({
  grower_photo_url,
  grower_username,
  planting_organization_id,
}) {
  const classes = useStyles();
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    // To do: get organization name from app context when available
    setOrganizationName('');
  }, [planting_organization_id]);

  return (
    <Box className={classes.box1}>
      <Avatar className={classes.avatar} src={grower_photo_url} />
      <Box className={classes.box2}>
        <Typography variant="h5">{grower_username}</Typography>
        <Typography variant="body1">{organizationName}</Typography>
      </Box>
    </Box>
  );
}

export default Grower;
