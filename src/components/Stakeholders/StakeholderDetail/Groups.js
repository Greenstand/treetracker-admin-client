import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, List, Typography } from '@material-ui/core';
import { StakeholdersContext } from '../../../context/StakeholdersContext';
import AdminIcon from '@material-ui/icons/SupervisorAccount';
import GrowerIcon from '@material-ui/icons/NaturePeople';
import StakeholderList from './List';

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
  console.log('StakeholderGroups data, render tall', data, render, tall);
  const classes = useStyles();
  const linkStakeholder = useContext(StakeholdersContext);

  const stakeholders = {
    children: { label: 'Children', icon: '' },
    parents: { label: 'Parents', icon: '' },
    users: { label: 'Admin Users', icon: <AdminIcon className={classes.pr} /> },
    growers: { label: 'Growers', icon: <GrowerIcon className={classes.pr} /> },
  };

  const handleLink = (type, id) => {
    linkStakeholder({ type, id });
  };

  return (
    <>
      {render.map((type) => (
        <Grid item xs={6} key={type}>
          <Grid item container justify="space-between" xs={12} direction="row">
            <div className={classes.flex}>
              {stakeholders[type]?.icon}
              <Typography variant="h6">
                {stakeholders[type]?.label} ({data[type]?.length || 0})
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.textWhite}
              onClick={() => handleLink(type, data.id)}
            >
              Link {type}
            </Button>
          </Grid>

          <List
            className={`${classes.listBox} ${tall ? classes.tall : ''}`}
            dense
          >
            {data[type] &&
              data[type].map((stakeholder) => (
                <StakeholderList
                  key={stakeholder.id}
                  data={stakeholder}
                  type={type}
                />
              ))}
          </List>
        </Grid>
      ))}
    </>
  );
}

export default StakeholderGroups;
