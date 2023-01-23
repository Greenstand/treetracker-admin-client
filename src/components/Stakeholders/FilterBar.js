import Add from './Add';
import React from 'react';
import StakeholderFilter from './Filter';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  margin: {
    marginTop: '3rem',
    marginBottom: '2rem',
  },
});

export default function StakeholderFilterBar() {
  const classes = useStyles();

  return (
    <div
      className={`${classes.flex} ${classes.spaceBetween} ${classes.margin}`}
    >
      <div>
        <StakeholderFilter />
      </div>
      <div className={classes.flex}>
        <Add />
      </div>
    </div>
  );
}
