import React, { useEffect, useContext } from 'react';

import FilterListIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
import GreenStandSvgLogo from '../images/GreenStandSvgLogo';
import GrowerReportingCard from '../ReportingCards';
import MenuItem from '@material-ui/core/MenuItem';
import MenuMui from '@material-ui/core/Menu';

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    document.title = `${documentTitle}`;
  }, []);

  const handleTimeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTimeClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.box}>
      <div className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </div>
      <div className={classes.rightBox}>
        <Box className={classes.box2}>
          <Grid container spacing={5} className={classes.version}>
            <Grid item xs={3}>
              <GreenStandSvgLogo />
              <Box display="inline" ml={2}>
                Version: {`${process.env.REACT_APP_VERSION}`}
              </Box>
            </Grid>
            <Grid item xs={5} className={classes.timeBox}>
              <Typography variant="body1" className={classes.time}>
                Last updated 22h ago
              </Typography>
              <Button
                variant="outlined"
                onClick={handleTimeClick}
                className={classes.timeButton}
              >
                <FilterListIcon color="primary" />
                <Typography variant="body1">Last month</Typography>
              </Button>
              <MenuMui
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleTimeClose}
                classes={{ paper: classes.timeMenu }}
              >
                <MenuItem onClick={handleTimeClose}>Last month</MenuItem>
                <MenuItem onClick={handleTimeClose}>Last two month</MenuItem>
                <MenuItem onClick={handleTimeClose}>Last six month</MenuItem>
                <MenuItem onClick={handleTimeClose}>Last year</MenuItem>
              </MenuMui>
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
            <Grid className={classes.statCardGrid} container xs={12}>
              <Grid item xs={4}>
                <GrowerReportingCard />
              </Grid>
              <Grid item xs={4}>
                <GrowerReportingCard />
              </Grid>
              <Grid item xs={4}>
                <GrowerReportingCard />
              </Grid>
              <Grid item xs={4}>
                <GrowerReportingCard />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default withStyles(styles)(Home);
