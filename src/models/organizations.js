/*
 * The model for organizations function
 */
import * as loglevel from 'loglevel'
import api from '../api/treeTrackerApi'

const log = loglevel.getLogger('../models/organizations')

const organizations = {
  state: {
    organizationList: [],
  },
  reducers: {
    setOrganizationList(state, organizationList) {
      return {
        ...state,
        organizationList,
      }
    },
  },
  effects: {
    async loadOrganizations() {
      const organizationList = await api.getOrganizations()
      log.debug('load organizations from api:', organizationList.length)
      this.setOrganizationList(organizationList)
    },
  },
}

export default organizations
