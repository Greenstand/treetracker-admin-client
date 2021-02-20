/*
 * A simple model for tree filter
 */

export const ALL_SPECIES = 'ALL_SPECIES'
export const SPECIES_NOT_SET = 'SPECIES_NOT_SET'
export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS'
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET'
export const TAG_NOT_SET = 'TAG_NOT_SET'

export default class Filter {
  treeId
  //status
  dateStart
  dateEnd
  approved
  active
  planterId
  deviceId
  planterIdentifier
  speciesId
  tagId
  organizationId

  constructor(options) {
    Object.assign(this, options)
  }

  getWhereObj() {
    //{{{
    let where = {}

    if (this.treeId) {
      where.id = this.treeId
    }

    if (this.dateStart && this.dateEnd) {
      where.timeCreated = {
        between: [this.dateStart, this.dateEnd]
      }
    } else if (this.dateStart && !this.dateEnd) {
      where.timeCreated = {
        gte: this.dateStart
      }
    } else if (!this.dateStart && this.dateEnd) {
      where.timeCreated = {
        lte: this.dateEnd
      }
    }

    if (this.approved !== undefined) {
      where.approved = this.approved
    }

    if (this.rejected !== undefined) {
      where.rejected = this.rejected
    }

    if (this.active !== undefined) {
      where.active = this.active
    }

    if (this.planterId !== undefined && this.planterId.length > 0) {
      where.planterId = this.planterId
    }

    if (this.deviceId !== undefined && this.deviceId.length > 0) {
      where.deviceId = this.deviceId
    }

    if (this.planterIdentifier !== undefined && this.planterIdentifier.length > 0) {
      where.planterIdentifier = this.planterIdentifier
    }

    if (this.speciesId === SPECIES_NOT_SET) {
      where.speciesId = null
    } else if (this.speciesId !== ALL_SPECIES) {
      where.speciesId = this.speciesId
    }

    if (this.tagId === TAG_NOT_SET) {
      where.tagId = null
    } else if (this.tagId) {
      where.tagId = this.tagId
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organizationId = null
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organizationId = this.organizationId
    }

    return where
    //}}}
  }

  /*
   * A fn for array, to filter the data in memory, means, just use current
   * filter setting to filter an array
   * usage: someArray.filter(thisFilter.filter)
   * Note, not support start/end date yet.
   */
  filter = (element) => {
    if (this.active !== undefined && this.active !== element.active) {
      return false
    } else if (this.approved !== undefined && this.approved !== element.approved) {
      return false
    } else if (this.status !== undefined && this.status !== element.status) {
      return false
    } else {
      return true
    }
  }
}
