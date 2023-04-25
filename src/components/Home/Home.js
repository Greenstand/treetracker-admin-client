import React, { useState, useEffect, useContext } from 'react';

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
import {
  hasFreetownPermission,
  hasPermission,
  POLICIES,
} from '../../models/auth';
import {
  DashStatGrowerCount,
  DashStatTotalCaptures,
  DashStatUnprocessedCaptures,
  DashStatVerifiedCaptures,
} from '../DashStat.container';
import CustomTableFilter from 'components/common/CustomTableFilter/CustomTableFilter';
import GreenStandSvgLogo from '../images/GreenStandSvgLogo';
import ReportingCard1 from '../reportingCards/ReportingCard1';
import ReportingCard2 from '../reportingCards/ReportingCard2';
import ReportingCard3 from '../reportingCards/ReportingCard3';
import ReportingCard4 from '../reportingCards/ReportingCard4';
import ReportingCard5 from '../reportingCards/ReportingCard5';
import ReportingCard6 from '../reportingCards/ReportingCard6';
import ReportingCard7 from '../reportingCards/ReportingCard7';
import ReportingCard8 from '../reportingCards/ReportingCard8';
import MenuItem from '@material-ui/core/MenuItem';
import MenuMui from '@material-ui/core/Menu';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import log from 'loglevel';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateTime, setUpdateTime] = useState(undefined);
  const [filter, setFilter] = useState({});
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  useEffect(() => {
    document.title = `${documentTitle}`;
  }, []);

  // the reporting card, update time, the time range
  useEffect(() => {
    async function loadUpdateTime() {
      const res = await axios(
        `${process.env.REACT_APP_REPORTING_API_ROOT}/capture/statistics?`
      );
      const { data } = res;
      setUpdateTime(data.last_updated_at);
    }
    loadUpdateTime();
  }, []);

  const timeRange = [
    { range: 30, text: 'Last Month' },
    { range: 30 * 6, text: 'Last 6 Months' },
    { range: 365, text: 'Last Year' },
    { range: 365 * 100, text: 'All' },
    { range: 1, text: 'Custom Date Range' },
  ];
  const [timeRangeIndex, setTimeRangeIndex] = useState(3);
  const [startDate, setStartDate] = useState('1970-01-01');
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleTimeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderDateFilter = () => {
    setTimeRangeIndex(timeRange.length - 1);
    setAnchorEl(null);
    setIsDateFilterOpen(true);
  };

  const handleDateFilterResetButton = (index) => {
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setStartDate(
      format(subDays(new Date(), timeRange[index].range), 'yyyy-MM-dd')
    );
    setTimeRangeIndex(index);
  };

  const handleTimeClose = (index) => {
    log.warn('index: ', index);
    setAnchorEl(null);
    if (isNaN(index)) return;
    setTimeRangeIndex(index);
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setStartDate(
      format(subDays(new Date(), timeRange[index].range), 'yyyy-MM-dd')
    );
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    setStartDate(filter?.start_date);
    setEndDate(filter?.end_date);
  };

  const handleCustomTimeChange = (e) => {
    let updatedFilter = { ...filter };
    updatedFilter[e?.target?.id] = e?.target?.value;
    setFilter(updatedFilter);
  };

  return (
    <Grid className={classes.box}>
      <CustomTableFilter
        isFilterOpen={isDateFilterOpen}
        filter={filter}
        filterType="date"
        setFilter={setFilter}
        setIsFilterOpen={setIsDateFilterOpen}
        alternativeHandleChange={handleCustomTimeChange}
        alternativeHandleOnFormSubmit={handleCustomTimeSubmit}
        startDate={filter?.start_date}
        endDate={filter?.end_date}
        extraResetButtonAction={() =>
          handleDateFilterResetButton(timeRange.length - 2)
        }
      />
      <Grid className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </Grid>
      <Grid className={classes.rightBox}>
        <Box className={classes.box2}>
          <Grid container spacing={5} className={classes.version}>
            <Grid item>
              <GreenStandSvgLogo />
              <Box display="inline" ml={2}>
                Version: {`${process.env.REACT_APP_VERSION}`}
              </Box>
            </Grid>
            {hasFreetownPermission(appContext.user) && (
              <Grid item xs={5} className={classes.timeBox}>
                {updateTime && (
                  <Typography variant="body1" className={classes.time}>
                    Last updated{' '}
                    {formatDistanceToNow(new Date(updateTime), {
                      addSuffix: true,
                    })}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  onClick={handleTimeClick}
                  className={classes.timeButton}
                >
                  <FilterListIcon color="primary" />
                  <Typography variant="body1">
                    {timeRange[timeRangeIndex].text}
                  </Typography>
                </Button>
                <MenuMui
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleTimeClose}
                  classes={{ paper: classes.timeMenu }}
                >
                  {timeRange.map((item, index) => {
                    if (item.text === 'Custom Date Range') {
                      return (
                        <MenuItem onClick={() => renderDateFilter()}>
                          {timeRange[index].text}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => handleTimeClose(index)}
                        >
                          {timeRange[index].text}
                        </MenuItem>
                      );
                    }
                  })}
                </MenuMui>
              </Grid>
            )}
          </Grid>
          <div className={classes.dashstatWraper}>
            {hasPermission(appContext.user, [
              POLICIES.SUPER_PERMISSION,
              POLICIES.LIST_TREE,
              POLICIES.APPROVE_TREE,
            ]) &&
              !hasFreetownPermission(appContext.user) && (
                <>
                  <DashStatTotalCaptures />
                  <DashStatUnprocessedCaptures />
                  <DashStatVerifiedCaptures />
                </>
              )}
            {hasPermission(appContext.user, [
              POLICIES.SUPER_PERMISSION,
              POLICIES.LIST_PLANTER,
            ]) &&
              !hasFreetownPermission(appContext.user) && (
                <DashStatGrowerCount />
              )}
            {hasFreetownPermission(appContext.user) && (
              <Grid item xs={12} className={classes.statCardGrid} container>
                <Grid item xs={4}>
                  <ReportingCard1 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard2 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard3 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard4 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard5 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard6 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard7 startDate={startDate} endDate={endDate} />
                </Grid>
                <Grid item xs={4}>
                  <ReportingCard8 startDate={startDate} endDate={endDate} />
                </Grid>
              </Grid>
            )}
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(Home);
