import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, List, Typography } from '@material-ui/core';
import AdminIcon from '@material-ui/icons/SupervisorAccount';
import GrowerIcon from '@material-ui/icons/NaturePeople';
import StakeholderList from './List';
import LinkStakeholder from './LinkStakeholder';
import { StakeholdersContext } from 'context/StakeholdersContext';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  pr: {
    paddingRight: 8,
  },
  textWhite: {
    color: 'white',
  },
  listBox: {
    marginTop: 12,
    borderRadius: 4,
    height: 112,
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    border: '1px solid rgba(0,0,0,0.1)',
  },
  tall: {
    height: 260,
  },
});

function StakeholderGroups({ data, render, tall }) {
  const classes = useStyles();
  const {
    stakeholders,
    setStakeholders,
    unlinkedStakeholders,
    setUnlinkedStakeholders,
  } = useContext(StakeholdersContext);

  const stakeholder = {
    children: { label: 'Children', icon: '' },
    parents: { label: 'Parents', icon: '' },
    users: { label: 'Admin Users', icon: <AdminIcon className={classes.pr} /> },
    growers: { label: 'Growers', icon: <GrowerIcon className={classes.pr} /> },
  };

  const onUnlink = (stakeholder, data, type) => {
    console.log('onUnlink -- ', stakeholder, data, type);
    const stillLinked = data[type].filter((s) => s.id != stakeholder.id);
    const linked = stakeholders.map((s) => {
      if (s.id === data.id) {
        s[type] = stillLinked;
      }
      return s;
    });
    setStakeholders(linked);
    const unlinked = [...unlinkedStakeholders, stakeholder];
    setUnlinkedStakeholders(unlinked);
  };

  return (
    <>
      {render.map((type) => (
        <Grid item xs={6} key={type}>
          <Grid item container justify="space-between" xs={12} direction="row">
            <div className={classes.flex}>
              {stakeholder[type]?.icon}
              <Typography variant="h6">
                {stakeholder[type]?.label} ({data[type]?.length || 0})
              </Typography>
            </div>
            <LinkStakeholder id={data.id} type={type} />
          </Grid>

          <List
            className={`${classes.listBox} ${tall ? classes.tall : ''}`}
            dense
          >
            {data[type] &&
              data[type].map((stakeholder) => (
                <StakeholderList
                  key={stakeholder.id}
                  id={data.id}
                  data={stakeholder}
                  type={type}
                  linked={true}
                  onLinkUpdate={() => onUnlink(stakeholder, data, type)}
                />
              ))}
          </List>
        </Grid>
      ))}
    </>
  );
}

export default StakeholderGroups;
