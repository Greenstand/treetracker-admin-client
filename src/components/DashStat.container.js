import React, { useEffect, useContext } from 'react';

// import withData from './common/withData';
import DashStat from './DashStat';
import { countToLocaleString } from '../common/numbers';
import theme from './common/theme';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';

import api from '../api/planters';
import { AppContext } from './Context';

function DashStatTotalCaptures(props) {
  // data ===> state.captures.totalCaptureCount
  // const { totalPlanterCount, setTotalPlanterCount } = useContext(AppContext);

  // useEffect(() => {
  //   getTotalPlanterCount();
  // }, []);

  // async function getTotalPlanterCount() {
  //   const { count } = await api.getCount({});
  //   setTotalPlanterCount(count);
  // }

  return (
    <DashStat
      color={theme.palette.stats.green}
      Icon={NatureOutlinedIcon}
      label={'Total Captures'}
      data={countToLocaleString(111)}
      {...props}
    />
  );
}

function DashStatUnprocessedCaptures(props) {
  // data ===> state.captures.unprocessedCaptureCount
  // const { totalPlanterCount, setTotalPlanterCount } = useContext(AppContext);

  // useEffect(() => {
  //   getTotalPlanterCount();
  // }, []);

  // async function getTotalPlanterCount() {
  //   const { count } = await api.getCount({});
  //   setTotalPlanterCount(count);
  // }

  return (
    <DashStat
      color={theme.palette.stats.red}
      Icon={LocalOfferOutlinedIcon}
      label={'Untagged Captures'}
      data={countToLocaleString(111)}
      {...props}
    />
  );
}

function DashStatVerifiedCaptures(props) {
  // data ===> state.captures.verifiedCaptureCount
  // const { totalPlanterCount, setTotalPlanterCount } = useContext(AppContext);

  // useEffect(() => {
  //   getTotalPlanterCount();
  // }, []);

  // async function getTotalPlanterCount() {
  //   const { count } = await api.getCount({});
  //   setTotalPlanterCount(count);
  // }

  return (
    <DashStat
      color={theme.palette.stats.orange}
      Icon={CheckCircleOutlineOutlinedIcon}
      label={'Verified Captures'}
      data={countToLocaleString(111)}
      {...props}
    />
  );
}

function DashStatPlanterCount(props) {
  const { totalPlanterCount, setTotalPlanterCount } = useContext(AppContext);

  useEffect(() => {
    getTotalPlanterCount();
  }, []);

  async function getTotalPlanterCount() {
    const { count } = await api.getCount({});
    setTotalPlanterCount(count);
  }

  return (
    <DashStat
      color={theme.palette.stats.orange}
      Icon={PeopleOutlineOutlinedIcon}
      label={'Planters'}
      data={countToLocaleString(totalPlanterCount)}
      {...props}
    />
  );
}

export {
  DashStatPlanterCount,
  DashStatVerifiedCaptures,
  DashStatUnprocessedCaptures,
  DashStatTotalCaptures,
};
