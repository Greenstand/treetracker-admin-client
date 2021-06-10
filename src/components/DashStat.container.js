import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import withData from './common/withData';
import DashStat from './DashStat';
import { countToLocaleString } from '../common/numbers';
import theme from './common/theme';

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';

function DashStatTotalCapturesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.green}
      Icon={NatureOutlinedIcon}
      label={'Total Captures'}
      {...props}
    />
  );
}

export const DashStatTotalCaptures = compose(
  connect(
    (state) => ({
      data: countToLocaleString(state.captures.totalCaptureCount),
      needsRefresh: true,
    }),
    (dispatch) => ({
      fetch: dispatch.captures.getTotalCaptureCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatTotalCapturesComponent(props, El),
)(DashStat);

function DashStatUnprocessedCapturesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.red}
      Icon={LocalOfferOutlinedIcon}
      label={'Untagged Captures'}
      {...props}
    />
  );
}

export const DashStatUnprocessedCaptures = compose(
  connect(
    (state) => ({
      data: countToLocaleString(state.captures.unprocessedCaptureCount),
      needsRefresh: true,
    }),
    (dispatch) => ({
      fetch: dispatch.captures.getUnprocessedCaptureCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatUnprocessedCapturesComponent(props, El),
)(DashStat);

function DashStatVerifiedCapturesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.orange}
      Icon={CheckCircleOutlineOutlinedIcon}
      label={'Verified Captures'}
      {...props}
    />
  );
}

export const DashStatVerifiedCaptures = compose(
  connect(
    (state) => ({
      data:
        state.captures.verifiedCaptureCount !== null
          ? countToLocaleString(state.captures.verifiedCaptureCount)
          : null,
      needsRefresh: true,
    }),
    (dispatch) => ({
      fetch: dispatch.captures.getVerifiedCaptureCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatVerifiedCapturesComponent(props, El),
)(DashStat);

function DashStatPlanterCountComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.orange}
      Icon={PeopleOutlineOutlinedIcon}
      label={'Planters'}
      {...props}
    />
  );
}

export const DashStatPlanterCount = compose(
  connect(
    (state) => ({
      data: countToLocaleString(state.planters.totalPlanterCount),
      needsRefresh: true,
    }),
    (dispatch) => ({
      fetch: dispatch.planters.getTotalPlanterCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatPlanterCountComponent(props, El),
)(DashStat);
