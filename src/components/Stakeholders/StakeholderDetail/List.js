import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Grid, ListItem } from '@material-ui/core';
import UnlinkIcon from '@material-ui/icons/LinkOff';
import LinkIcon from '@material-ui/icons/Link';
import { StakeholdersContext } from '../../../context/StakeholdersContext';
import ParentChildListItem from './ParentChildListItem';

const useStyles = makeStyles({
  listItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    borderRadius: 4,
  },
});

function StakeholderList({ id, data, type, linked }) {
  const classes = useStyles();
  const [isLinked, setIsLinked] = useState(linked);
  const { deleteStakeholder } = useContext(StakeholdersContext);

  const handleChange = (e, data) => {
    setIsLinked(!isLinked);
    const confirmed = window.confirm(
      'Are you sure? Continuing will delete the stakeholder from the system.'
    );
    if (confirmed) {
      deleteStakeholder(id, {
        type,
        linked: !linked,
        data: data,
      });
    }
  };

  return (
    <Paper elevation={1}>
      <ListItem className={classes.listItem}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <Grid item container direction="row" alignItems="center" xs={11}>
            <ParentChildListItem data={data} />
          </Grid>
          <Grid item xs={1}>
            {isLinked ? (
              <IconButton onClick={(e) => handleChange(e, data)}>
                <UnlinkIcon />
              </IconButton>
            ) : (
              <IconButton onClick={(e) => handleChange(e, data)}>
                <LinkIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}

export default StakeholderList;
