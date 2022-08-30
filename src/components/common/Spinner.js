import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  progressContainer: {
    justifyContent: 'space-around',
    padding: theme.spacing(2),
  },
});

function Spinner(props) {
  const { classes } = props;

  return (
    <Grid item container className={classes.progressContainer}>
      <CircularProgress />
    </Grid>
  );
}

export default withStyles(styles)(Spinner);
