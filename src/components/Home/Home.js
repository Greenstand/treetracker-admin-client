import React, { useEffect, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import styles from './Home.styles';
import { documentTitle } from '../../common/variables';
import Menu from '../common/Menu';
import { AppContext } from '../../context/AppContext';
import { hasPermission, POLICIES } from '../../models/auth';
import {
  DashStatGrowerCount,
  DashStatTotalCaptures,
  DashStatUnprocessedCaptures,
  DashStatVerifiedCaptures,
} from '../DashStat.container';
import GreenStandSvgLogo from '../common/GreenStandSvgLogo';

/**
 * @function
 * @name Home
 * @description renders the home page
 * @param {object} props
 * @param {object} props.classes css classes
 *
 * @returns {React.Component} Home component
 */
function Home(props) {
  const { classes } = props;
  const appContext = useContext(AppContext);

  useEffect(() => {
    document.title = `${documentTitle}`; // update page title
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
          ]) && <DashStatGrowerCount />}
        </Grid>
      </div>
    </div>
  );
}

export default withStyles(styles)(Home);
