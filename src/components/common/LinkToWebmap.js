import React from 'react';
import Link from '@material-ui/core/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  openInNewIcon: {
    margin: theme.spacing(-0.5, 0.5),
  },
}));

export default function LinkToWebmap(props) {
  const { value, type } = props;
  const classes = useStyles();

  //the web map needs the id for the request but we want to display the reference_id
  const urlId = value?.id || value;
  const displayId = value?.reference_id || value;

  return (
    <Link
      onClick={(e) => e.stopPropagation()}
      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?${type}id=${urlId}`}
      underline="always"
      target="_blank"
    >
      {displayId?.length > 7 ? `${displayId.slice(0, 7)}...` : displayId}
      <OpenInNewIcon fontSize="inherit" className={classes.openInNewIcon} />
    </Link>
  );
}
