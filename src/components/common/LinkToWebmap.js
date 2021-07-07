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

  return (
    <Link
      onClick={(e) => e.stopPropagation()}
      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?${type}id=${value}`}
      underline="always"
      target="_blank"
    >
      {value}
      <OpenInNewIcon fontSize="inherit" className={classes.openInNewIcon} />
    </Link>
  );
}
