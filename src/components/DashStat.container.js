import React, { useEffect, useState } from 'react';

import DashStat from './DashStat';
import { countToLocaleString } from '../common/numbers';
import theme from './common/theme';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';

import growersApi from '../api/growers';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';
import { captureStatus } from 'common/variables';

function DashStatTotalCaptures(props) {
  const unprocessedFilter = new FilterModel({
    status: captureStatus.UNPROCESSED,
  });
  const approvedFilter = new FilterModel();

  const [total, setTotal] = useState(null);

  // Temporary mid-migration retrofix for legacy dash stats
  const getTotal = async () => {
    const [
      { count: unprocessedCount },
      { count: approvedCount },
    ] = await Promise.all([
      api.getRawCaptureCount({ filter: unprocessedFilter }),
      api.getCaptureCount(approvedFilter),
    ]);
    setTotal(unprocessedCount + approvedCount);
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
    status: captureStatus.UNPROCESSED,
  });

  const [totalUnprocessed, setTotalUnprocessed] = useState(null);

  const getTotalUnprocessed = async () => {
    const { count } = await api.getRawCaptureCount({
      filter: unprocessedFilter,
    });
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
  const filter = new FilterModel();

  const [totalVerified, setTotalVerified] = useState(null);

  const getTotalVerified = async () => {
    const { count } = await api.getCaptureCount(filter);
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
    const { count } = await growersApi.getCount(growerFilter);
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
