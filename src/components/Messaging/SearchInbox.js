import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  wrapForm: {
    width: '100%',
    borderTop: '2px solid black',
  },
  field: {
    width: '100%',
    color: theme.palette.primary.main,
    wordWrap: 'break-word',
  },
}));

const SearchInbox = ({ setSearch }) => {
  const { wrapForm, field } = useStyles();

  return (
    <form className={wrapForm} noValidate autoComplete="off">
      <TextField
        id="outlined-search"
        label="Search by name or ID ..."
        type="search"
        variant="filled"
        className={field}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default SearchInbox;
