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
const log = require('loglevel');

// All Raw Captures, both unprocessed and those reviewed and verified

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

// All Raw Captures that have not been reviewed and marked valid by someone designated in org

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

// Verified Raw Captures have been reviewed and verified as valid by someone designated in org

function DashStatVerifiedCaptures(props) {
  const filter = new FilterModel();

  const [totalVerified, setTotalVerified] = useState(null);

  const getTotalVerified = async () => {
    const { count } = await api.getCaptureCount(filter);
    setTotalVerified(count);
  };

  // TEST:
  // the count from api.getCaptureCount()
  // should match
  // the count from api.getRawCaptureCount({ filter: new FilterModel({ status: captureStatus.APPROVED }) })

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

// Captures should all be "matched" to Tree IDs, or

function DashStatMatchedCaptures(props) {
  const filter = new FilterModel({ tree_id: 'not null' });

  const [totalMatched, setTotalMatched] = useState(null);

  const getTotalMatched = async () => {
    const data = await api.getCaptureCount(filter);
    log.debug('matched capture data', data);
    setTotalMatched(data.count);
  };

  useEffect(() => {
    getTotalMatched();
  }, []);

  return (
    <DashStat
      color={theme.palette.stats.orange}
      Icon={CheckCircleOutlineOutlinedIcon}
      label={'Matched Captures'}
      data={countToLocaleString(totalMatched)}
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
  DashStatMatchedCaptures,
};
