import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import withData from './common/withData'
import DashStat from './DashStat'
import { countToLocaleString } from '../common/numbers'
import theme from './common/theme'

import NatureOutlinedIcon from '@material-ui/icons/NatureOutlined'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined'

export const DashStatTotalTrees = compose(
  connect(
    state => ({
      data: state.trees.treeCount !== null ? countToLocaleString(state.trees.treeCount) : null,
      needsRefresh: state.trees.invalidateTreeCount
    }),
    dispatch => ({
      fetch: dispatch.trees.getTreeCount,
    }),
  ),
  withData,
  (El) => ((props) => (<El
    color={theme.palette.stats.green}
    Icon={NatureOutlinedIcon}
    label={'Total Trees'} {...props} />)),
)(DashStat);

export const DashStatUnprocessedTrees = compose(
  connect(
    state => ({
      data: state.verity.treeCount !== null ? countToLocaleString(state.verity.treeCount) : null,
      needsRefresh: state.verity.invalidateTreeCount
    }),
    dispatch => ({
      fetch: dispatch.verity.getTreeCount,
    })
  ),
  withData,
  (El) => ((props) => (<El
    color={theme.palette.stats.red}
    Icon={LocalOfferOutlinedIcon}
    label={'Untagged Trees'} {...props} />)),
)(DashStat);

export const DashStatVerifiedTrees = compose(
  connect(
    state => ({
      data: state.verity.verifiedTreeCount !== null ? countToLocaleString(state.verity.verifiedTreeCount) : null,
      needsRefresh: state.verity.invalidateVerifiedCount
    }),
    dispatch => ({
      fetch: dispatch.verity.getVerifiedTreeCount,
    })
  ),
  withData,
  (El) => ((props) => (<El
    color={theme.palette.stats.orange}
    Icon={CheckCircleOutlineOutlinedIcon}
    label={'Verified Trees'} {...props} />)),
)(DashStat);

export const DashStatPlanterCount = compose(
  connect(
    state => ({
      data: state.planters.count !== null ? countToLocaleString(state.planters.count) : null
    }),
    dispatch => ({
      fetch: dispatch.planters.count
    })
  ),
  withData,
  (El) => ((props) => (<El
    color={theme.palette.stats.orange}
    Icon={PeopleOutlineOutlinedIcon}
    label={'Planters'} {...props} />)),
)(DashStat);
