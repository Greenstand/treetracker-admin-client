import React, { useEffect, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import GreenStandSvgLogo from './common/GreenStandSvgLogo';

import Menu, { MENU_WIDTH } from './common/Menu';
import { documentTitle } from '../common/variables';
import { AppContext } from '../context/AppContext';
import { hasPermission, POLICIES } from '../models/auth';
import {
  DashStatPlanterCount,
  DashStatTotalCaptures,
  DashStatUnprocessedCaptures,
  DashStatVerifiedCaptures,
} from './DashStat.container';

const style = () => ({
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  menuAside: {
    height: '100%',
    width: MENU_WIDTH,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  menu: {
    height: '100%',
    width: MENU_WIDTH,
    overflow: 'hidden',
  },
  rightBox: {
    height: '100%',
    position: 'absolute',
    padding: '40px',
    left: MENU_WIDTH,
    top: 0,
    right: 0,
    backgroundColor: 'rgb(239, 239, 239)',
    boxSizing: 'border-box',
  },
  welcomeBox: {
    height: '100%',
  },
  title: {
    fill: '#9f9f9f',
    fontSize: 48,
    fontFamily: 'Lato,Roboto,Helvetica,Arial,sans-serif',
    fontWeight: '400',
    lineHeight: '1.235',
  },
});

function Home(props) {
  const { classes } = props;
  const appContext = useContext(AppContext);

  useEffect(() => {
    /** update html document title */
    document.title = documentTitle;
  }, []);

  return (
    <div className={classes.box}>
      <div className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </div>
      <div className={classes.rightBox}>
        <Grid container spacing={5}>
          <Grid item xs={3}>
            <GreenStandSvgLogo />
            <Box display="inline" ml={2}>
              Version: {`${process.env.REACT_APP_VERSION}`}
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={5}
          className={classes.welcomeBox}
          justify="center"
        >
          {hasPermission(appContext.user, [
            POLICIES.SUPER_PERMISSION,
            POLICIES.LIST_TREE,
            POLICIES.APPROVE_TREE,
          ]) && (
            <>
              <DashStatTotalCaptures />
              <DashStatUnprocessedCaptures />
              <DashStatVerifiedCaptures />
            </>
          )}
          {hasPermission(appContext.user, [
            POLICIES.SUPER_PERMISSION,
            POLICIES.LIST_PLANTER,
          ]) && <DashStatPlanterCount />}
        </Grid>
      </div>
    </div>
  );
}

export default withStyles(style)(Home);
