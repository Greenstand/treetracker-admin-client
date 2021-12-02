import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import RoleIcon from '@material-ui/icons/Security';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  pr: {
    paddingRight: 8,
  },
});

export default function UserListItem({ data }) {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={4}>
        <Typography>{data.username}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography>{data.fullName}</Typography>
      </Grid>
      <Grid item xs={4} className={classes.flex}>
        <RoleIcon className={classes.pr} />
        <Typography>{data.roles}</Typography>
      </Grid>
    </>
  );
}
