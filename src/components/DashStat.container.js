import React, { useEffect, useState } from 'react';

import DashStat from './DashStat';
import { countToLocaleString } from '../common/numbers';
import theme from './common/theme';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';

import apiPlanters from '../api/planters';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';

function DashStatTotalCaptures(props) {
  const defaultFilter = new FilterModel({});

  const [total, setTotal] = useState(0);

  const getTotal = async () => {
    const { count } = await api.getCaptureCount(defaultFilter);
    setTotal(count);
  };

  useEffect(() => {
    getTotal();
  }, []);

  return (
    <DashStat
      color={theme.palette.stats.green}
      Icon={NatureOutlinedIcon}
      label={'Total Captures'}
      data={countToLocaleString(total)}
      {...props}
    />
  );
}

function DashStatUnprocessedCaptures(props) {
  const unprocessedFilter = new FilterModel({
    approved: false,
    active: true,
  });

  const [totalUnprocessed, setTotalUnprocessed] = useState(0);

  const getTotalUnprocessed = async () => {
    const { count } = await api.getCaptureCount(unprocessedFilter);
    setTotalUnprocessed(count);
  };

  useEffect(() => {
    getTotalUnprocessed();
  }, []);

  return (
    <DashStat
      color={theme.palette.stats.red}
      Icon={LocalOfferOutlinedIcon}
      label={'Untagged Captures'}
      data={countToLocaleString(totalUnprocessed)}
      {...props}
    />
  );
}

function DashStatVerifiedCaptures(props) {
  const verifiedFilter = new FilterModel({
    approved: true,
    active: true,
  });

  const [totalVerified, setTotalVerified] = useState(0);

  const getTotalVerified = async () => {
    const { count } = await api.getCaptureCount(verifiedFilter);
    setTotalVerified(count);
  };

  useEffect(() => {
    getTotalVerified();
  }, []);

  return (
    <DashStat
      color={theme.palette.stats.orange}
      Icon={CheckCircleOutlineOutlinedIcon}
      label={'Verified Captures'}
      data={countToLocaleString(totalVerified)}
      {...props}
    />
  );
}

function DashStatPlanterCount(props) {
  const planterFilter = new FilterModel({
    active: true,
  });

  const [totalPlanterCount, setTotalPlanterCount] = useState(0);

  const getTotalPlanterCount = async () => {
    const { count } = await apiPlanters.getCount(planterFilter);
    setTotalPlanterCount(count);
  };

  useEffect(() => {
    getTotalPlanterCount();
  }, []);

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
