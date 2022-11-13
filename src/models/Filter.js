/*
 * A simple model for capture filter
 */

export const ALL_SPECIES = 'ALL_SPECIES';
export const SPECIES_ANY_SET = 'SPECIES_ANY_SET';
export const SPECIES_NOT_SET = 'SPECIES_NOT_SET';
export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';
export const TAG_NOT_SET = 'TAG_NOT_SET';
export const ANY_TAG_SET = 'ANY_TAG_SET';
// import { tokenizationStates } from '../common/variables';

export default class Filter {
  uuid;
  captureId;
  dateStart;
  dateEnd;
  approved;
  active;
  planterId;
  deviceIdentifier;
  planterIdentifier;
  speciesId;
  tagId;
  organizationId;
  tokenId;
  verifyStatus;
  wallet;

  constructor(options) {
    Object.assign(this, options);
  }

  getWhereObj() {
    let where = {};

    if (this.uuid) {
      where.id = this.uuid;
    }

    if (this.captureId) {
      where.reference_id = this.captureId;
    }

    if (this.dateStart) {
      where.startDate = this.dateStart;
    }

    if (this.dateEnd) {
      where.endDate = this.dateEnd;
    }

    if (this.approved !== undefined) {
      where.approved = this.approved;
    }

    if (this.active !== undefined) {
      where.active = this.active;
    }

    if (this.deviceIdentifier) {
      where.device_identifier = this.deviceIdentifier;
    }

    if (this.wallet) {
      where.wallet = this.wallet;
    }

    if (this.planterIdentifier) {
      where.wallet = this.planterIdentifier;
    }

    if (this.speciesId === SPECIES_NOT_SET) {
      where.species_id = null;
    } else if (this.speciesId === SPECIES_ANY_SET) {
      where.species_id = { neq: null };
    } else if (this.speciesId !== ALL_SPECIES) {
      where.species_id = this.speciesId;
    }

    if (this.tagId === TAG_NOT_SET) {
      where.tag = null;
    } else if (this.tagId === ANY_TAG_SET) {
      where.tag = '0';
    } else if (this.tagId) {
      where.tag = this.tagId;
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organization_id = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organization_id = this.stakeholderUUID;
    }

    // if (this.stakeholderUUID === ORGANIZATION_NOT_SET) {
    //   where.stakeholderUUID = null;
    // } else if (this.stakeholderUUID !== ALL_ORGANIZATIONS) {
    //   where.stakeholderUUID = this.stakeholderUUID;
    // }

    // if (this.tokenId === tokenizationStates.TOKENIZED) {
    //   where.tokenId = { neq: null };
    // } else if (this.tokenId === tokenizationStates.NOT_TOKENIZED) {
    //   where.tokenId = { eq: null };
    // }

    // Fields that allow multiple values should be included as "or"s
    // inside an "and" clause: { and: [ {or: [...]}, {or: [...]} ] }

    // const planterIds = (this.planterId || '')
    //   .split(',')
    //   .filter((item) => item)
    //   .map((item) => ({ planterId: item.trim() }));

    // const andClause = [this.verifyStatus, planterIds]
    //   .map((array) => {
    //     return array?.length ? { or: array } : null;
    //   })
    //   .filter((term) => term);

    // if (andClause.length) {
    //   where.and = andClause;
    // }

    // return where;

    let orCondition = false;
    const { ...restFilter } = where;

    if (this.planterId) {
      const planterIds = this.planterId.split(',').map((item) => item.trim());

      if (planterIds.length === 1) {
        restFilter.grower_account_id = this.planterId;
      } else {
        if (!orCondition) {
          orCondition = true;
          where = [];
        }
        planterIds.forEach((planterId) => {
          if (planterId) {
            where.push({
              grower_account_id: planterId,
            });
          }
        });
      }
    }

    return orCondition
      ? { ...restFilter, or: where }
      : { ...restFilter, ...where };
  }

  /*
   * A fn for array, to filter the data in memory, means, just use current
   * filter setting to filter an array
   * usage: someArray.filter(thisFilter.filter)
   * Note, not support start/end date yet.
   */
  filter = (element) => {
    if (this.active !== undefined && this.active !== element.active) {
      return false;
    } else if (
      this.approved !== undefined &&
      this.approved !== element.approved
    ) {
      return false;
    } else if (this.status !== undefined && this.status !== element.status) {
      return false;
    } else {
      return true;
    }
  };

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.active !== undefined && this.approved !== undefined) {
      numFilters += 1;
    }

    if (this.uuid) {
      numFilters += 1;
    }

    if (this.captureId) {
      numFilters += 1;
    }

    if (this.wallet) {
      numFilters += 1;
    }

    if (this.deviceIdentifier) {
      numFilters += 1;
    }

    if (this.planterId) {
      numFilters += 1;
    }

    if (this.planterIdentifier) {
      numFilters += 1;
    }

    if (this.tagId > 0) {
      numFilters += 1;
    }

    if (this.dateStart) {
      numFilters += 1;
    }

    if (this.dateEnd) {
      numFilters += 1;
    }

    // organizationId and stakeholderUUID count as one filter
    if (this.organizationId && this.organizationId !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.speciesId && this.speciesId !== ALL_SPECIES) {
      numFilters += 1;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      numFilters += 1;
    }

    if (this.verifyStatus) {
      numFilters += this.verifyStatus.length;
    }

    return numFilters;
  }
}
