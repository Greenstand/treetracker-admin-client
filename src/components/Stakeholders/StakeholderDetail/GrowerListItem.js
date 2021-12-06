import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import IdIcon from '@material-ui/icons/Money';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  pr: {
    paddingRight: 8,
  },
});

function makeFullName(first, last) {
  return `${first} ${last}`;
}

export default function GrowerListItem({ data }) {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={5}>
        <Typography>{makeFullName(data.first_name, data.last_name)}</Typography>
      </Grid>
      <Grid item xs={3} className={classes.flex}>
        <IdIcon className={classes.pr} />
        <Typography>{data.id}</Typography>
      </Grid>
      <Grid item xs={4} className={classes.flex}>
        <CalendarIcon className={classes.pr} />
        <Typography>{data.createdAt}</Typography>
      </Grid>
    </>
  );
}
