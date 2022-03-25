import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  growerBox1: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  growerAvatar: {
    width: 48,
    height: 48,
  },
  growerBox2: {},
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
    <Box className={classes.growerBox1}>
      <Avatar className={classes.growerAvatar} src={grower_photo_url} />
      <Box className={classes.growerBox2}>
        <Typography variant="h5">{grower_username}</Typography>
        <Typography variant="body1">{organizationName}</Typography>
      </Box>
    </Box>
  );
}

export default Grower;
