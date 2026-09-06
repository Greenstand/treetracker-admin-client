import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';

import styles from './VerificationDashboard.styles';
import Menu from '../common/Menu';
import theme from '../common/theme';
import DashStat from '../DashStat';
import UnverifiedCapturesPanel from './UnverifiedCapturesPanel';
import { usePendingCaptureCount, useOldestWaiting } from './data';
import { AppContext } from '../../context/AppContext';
import { hasPermission, POLICIES } from '../../models/auth';

function DashStatCapturesPending() {
  const { data, isError } = usePendingCaptureCount();

  return (
    <DashStat
      label="Captures Pending"
      data={isError ? '—' : data}
      color={theme.palette.stats.red}
      Icon={NatureOutlinedIcon}
    />
  );
}

function DashStatOldestWaiting() {
  const { data, isError } = useOldestWaiting();

  return (
    <DashStat
      label="Oldest Waiting"
      data={isError ? '—' : data}
      color={theme.palette.stats.orange}
      Icon={AccessTimeOutlinedIcon}
    />
  );
}

function VerificationDashboard(props) {
  const { classes } = props;
  const appContext = useContext(AppContext);

  const canListCaptures = hasPermission(appContext.user, [
    POLICIES.SUPER_PERMISSION,
    POLICIES.LIST_TREE,
    POLICIES.APPROVE_TREE,
  ]);

  return (
    <Grid className={classes.box}>
      <Grid className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </Grid>
      <Grid className={classes.rightBox}>
        <Grid container className={classes.header}>
          <Grid item>
            <Typography variant="h5">Verification Dashboard</Typography>
            <Typography variant="body1" className={classes.subtitle}>
              Captures awaiting verification
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/verify/captures"
            >
              View all unverified captures
            </Button>
          </Grid>
        </Grid>

        {canListCaptures && (
          <React.Fragment>
            <div className={classes.dashstatWraper}>
              <DashStatCapturesPending />
              <DashStatOldestWaiting />
            </div>

            <div className={classes.split}>
              <UnverifiedCapturesPanel />
            </div>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(VerificationDashboard);
