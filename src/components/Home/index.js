import React, { useEffect, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import GreenStandSvgLogo from '../common/GreenStandSvgLogo';

import Menu, { MENU_WIDTH } from '../common/Menu';
import { documentTitle } from '../../common/variables';
import { AppContext } from '../../context/AppContext';
import { hasPermission, POLICIES } from '../../models/auth';
import {
  DashStatPlanterCount,
  DashStatTotalCaptures,
  DashStatUnprocessedCaptures,
  DashStatVerifiedCaptures,
} from '../DashStat.container';

import './styles.css';

function Home() {
  const appContext = useContext(AppContext);

  useEffect(() => {
    /** update html document title */
    document.title = documentTitle;
  }, []);

  return (
    <div className="Home">
      <div
        className="Home-Menu Home-Menu_position_left"
        style={{ width: MENU_WIDTH }}
      >
        <Paper
          elevation={3}
          className="Home-Menu Home-Menu_overFlow_hidden"
          style={{ width: MENU_WIDTH }}
        >
          <Menu variant="plain" />
        </Paper>
      </div>
      <div className="Home-Box" style={{ left: MENU_WIDTH }}>
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
          className="Home-WelcomeBox"
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

export default Home;
