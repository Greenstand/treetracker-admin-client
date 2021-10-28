import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import useStyles from './EarningsTable.styles';
import Menu from '../common/Menu';

/**
 * @function
 * @name EarningsLeftMenu
 * @description renders left menu
 *
 * @param {Object} props - component props
 * @param {Object} props.classes - component css classes
 * @returns {React.Component} left menu
 */
function EarningsLeftMenu(props) {
  const classes = useStyles();
  return (
    <Grid item xs={3}>
      <Paper elevation={3} className={classes.menu}>
        <Menu variant="plain" />
      </Paper>
    </Grid>
  );
}

/**
 * @function
 * @name EarningsTableTopar
 * @description renders earnings table top bar
 *
 * @param {Object} props - component props
 * @returns
 */
function EarningsTableTopar(props) {
  const classes = useStyles();
  return (
    <Grid item xs={9} container className={classes.rightBox}>
      <Grid item xs={12}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Grid container>
              <Grid item>
                <Typography variant="h2">Earnings</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item className={classes.earningsTableTopBarRight}>
            <Grid container justify="space-around">
              <Grid item>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.dowloadButton}
                >
                  <GetAppIcon />
                  <Typography variant="h5">EXPORT</Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.dowloadButton}
                >
                  <PublishIcon />
                  <Typography variant="h5">IMPORT</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/**
 * @function
 * @name EarningsTable
 * @description displays table containing  earnings data
 * @param {object} props - component props
 * @param {object} props.earnings - earnings data
 * @param {object} props.classes - css classes
 *
 * @returns {React.Component} earnings table
 */
function EarningsTable(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.box}>
      <EarningsLeftMenu />
      <EarningsTableTopar />
    </Grid>
  );
}

export default EarningsTable;
