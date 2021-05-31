import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Grid, ListItem } from '@material-ui/core';
import UnlinkIcon from '@material-ui/icons/LinkOff';
import UserListItem from './UserListItem';
import GrowerListItem from './GrowerListItem';
import ParentChildListItem from './ParentChildListItem';

const useStyles = makeStyles({
  listItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    borderRadius: 4,
  },
});

function StakeholderList({ data, type, dispatch }) {
  const classes = useStyles();

  const handleUnlink = (type, id) => {
    dispatch.unlinkStakeholder({ type, id });
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
          <Grid container direction="row" alignItems="center" xs={11}>
            {type === 'users' ? (
              <UserListItem data={data} />
            ) : type === 'growers' ? (
              <GrowerListItem data={data} />
            ) : (
              <ParentChildListItem data={data} />
            )}
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleUnlink(type, data.id)}>
              <UnlinkIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}

export default connect(
  //state
  (state) => ({
    state: state.stakeholders,
  }),
  //dispatch
  (dispatch) => ({
    dispatch: dispatch.stakeholders,
  }),
)(StakeholderList);
