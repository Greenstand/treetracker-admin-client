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

function DashStatTotalTreesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.green}
      Icon={NatureOutlinedIcon}
      label={'Total Trees'}
      {...props}
    />
  );
}

export const DashStatTotalTrees = compose(
  connect(
    (state) => ({
      data:
        state.trees.treeCount !== null
          ? countToLocaleString(state.trees.treeCount)
          : null,
      needsRefresh: state.trees.invalidateTreeCount,
    }),
    (dispatch) => ({
      fetch: dispatch.trees.getTreeCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatTotalTreesComponent(props, El),
)(DashStat);

function DashStatUnprocessedTreesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.red}
      Icon={LocalOfferOutlinedIcon}
      label={'Untagged Trees'}
      {...props}
    />
  );
}

export const DashStatUnprocessedTrees = compose(
  connect(
    (state) => ({
      data:
        state.verify.treeCount !== null
          ? countToLocaleString(state.verify.treeCount)
          : null,
      needsRefresh: state.verify.invalidateTreeCount,
    }),
    (dispatch) => ({
      fetch: dispatch.verify.getTreeCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatUnprocessedTreesComponent(props, El),
)(DashStat);

function DashStatVerifiedTreesComponent(props, El) {
  return (
    <El
      color={theme.palette.stats.orange}
      Icon={CheckCircleOutlineOutlinedIcon}
      label={'Verified Trees'}
      {...props}
    />
  );
}

export const DashStatVerifiedTrees = compose(
  connect(
    (state) => ({
      data:
        state.verify.verifiedTreeCount !== null
          ? countToLocaleString(state.verify.verifiedTreeCount)
          : null,
      needsRefresh: state.verify.invalidateVerifiedCount,
    }),
    (dispatch) => ({
      fetch: dispatch.verify.getVerifiedTreeCount,
    }),
  ),
  withData,
  (El) => (props) => DashStatVerifiedTreesComponent(props, El),
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
      data:
        state.planters.count !== null
          ? countToLocaleString(state.planters.count)
          : null,
    }),
    (dispatch) => ({
      fetch: dispatch.planters.count,
    }),
  ),
  withData,
  (El) => (props) => DashStatPlanterCountComponent(props, El),
)(DashStat);
