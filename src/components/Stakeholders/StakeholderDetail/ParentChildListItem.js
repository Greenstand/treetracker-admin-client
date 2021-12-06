import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import IdIcon from '@material-ui/icons/Money';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  pr: {
    paddingRight: 8,
  },
  logoSm: {
    height: 24,
    width: 24,
  },
});

export default function ParentChildListItem({ data }) {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={1}>
        <img src="./logo_192x192.png" alt="" className={classes.logoSm} />
      </Grid>
      <Grid item xs={6}>
        <Typography>{data.org_name}</Typography>
      </Grid>
      <Grid item xs={5} className={classes.flex}>
        <IdIcon className={classes.pr} />
        <Typography>{data.id}</Typography>
      </Grid>
    </>
  );
}
