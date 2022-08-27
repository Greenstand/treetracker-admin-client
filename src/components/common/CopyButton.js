import React from 'react';
import { IconButton } from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  copyButton: {
    margin: theme.spacing(-2, 0),
    padding: "8px 12px 8px 12px"
  },
}));

export function CopyButton(props) {
  const { value, label, confirmCopy } = props;
  const classes = useStyles();

  return (
    <IconButton
      className={classes.copyButton}
      title="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(value);
        confirmCopy(label);
      }}
    >
      <FileCopy fontSize="small" />
    </IconButton>
  );
}
