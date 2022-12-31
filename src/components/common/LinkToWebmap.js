import React from 'react';
import Link from '@material-ui/core/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  openInNewIcon: {
    margin: theme.spacing(-0.5, 0.5),
  },
}));

export const pathType = {
  tree: 'trees',
  planter: 'planters',
};

export default function LinkToWebmap(props) {
  const { value, type } = props;
  const classes = useStyles();

  const id = value?.reference_id || value;

  return (
    <Link
      onClick={(e) => e.stopPropagation()}
      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/${type}/${id}`}
      underline="always"
      target="_blank"
    >
      {id?.length > 7 ? `${id.slice(0, 7)}...` : id}
      <OpenInNewIcon fontSize="inherit" className={classes.openInNewIcon} />
    </Link>
  );
}
