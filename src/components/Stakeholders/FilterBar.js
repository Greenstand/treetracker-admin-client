import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Filter from './Filter';
import Add from './Add';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  my: {
    marginTop: '3rem',
    marginBottom: '2rem',
  },
});

export default function FilterBar() {
  const classes = useStyles();

  return (
    <div className={`${classes.flex} ${classes.spaceBetween} ${classes.my}`}>
      <div>
        <Filter />
      </div>
      <div className={classes.flex}>
        <Add />
      </div>
    </div>
  );
}
