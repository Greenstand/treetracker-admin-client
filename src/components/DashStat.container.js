import React, { useEffect, useState } from 'react';

import DashStat from './DashStat';
import { countToLocaleString } from '../common/numbers';
import theme from './common/theme';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';

import apiPlanters from '../api/growers';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';

function DashStatTotalCaptures(props) {
  const activeFilter = new FilterModel({
    active: true,
  });

  const [total, setTotal] = useState(null);

  const getTotal = async () => {
    console.log('-- dash getTotal');
    const { count } = await api.getCaptureCount(activeFilter);
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

  const [totalUnprocessed, setTotalUnprocessed] = useState(null);

  const getTotalUnprocessed = async () => {
    console.log('-- dash getTotalUnprocessed');
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

  const [totalVerified, setTotalVerified] = useState(null);

  const getTotalVerified = async () => {
    console.log('-- dash getTotalVerified');
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

function DashStatGrowerCount(props) {
  const growerFilter = new FilterModel();

  const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  const getTotalGrowerCount = async () => {
    const { count } = await apiPlanters.getCount(growerFilter);
    setTotalGrowerCount(parseInt(count));
  };

  useEffect(() => {
    getTotalGrowerCount();
  }, []);

  return (
    <DashStat
      color={theme.palette.stats.orange}
      Icon={PeopleOutlineOutlinedIcon}
      label={'Growers'}
      data={countToLocaleString(totalGrowerCount)}
      {...props}
    />
  );
}

export {
  DashStatGrowerCount,
  DashStatVerifiedCaptures,
  DashStatUnprocessedCaptures,
  DashStatTotalCaptures,
};
