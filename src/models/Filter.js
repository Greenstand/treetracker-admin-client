/*
 * A simple model for capture filter
 */

export const ALL_SPECIES = 'ALL_SPECIES';
export const SPECIES_ANY_SET = 'SPECIES_ANY_SET';
export const SPECIES_NOT_SET = 'SPECIES_NOT_SET';
export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';
export const ALL_TAGS = 'ALL_TAGS';
export const TAG_NOT_SET = 'TAG_NOT_SET';
export const ANY_TAG_SET = 'ANY_TAG_SET';
export const ALL_WALLETS = 'ALL_WALLETS';
import { tokenizationStates } from '../common/variables';
// import log from 'loglevel';

export default class Filter {
  uuid;
  captureId;
  startDate;
  endDate;
  grower_account_id;
  device_identifier;
  wallet;
  species_id;
  tag_id;
  organization_id;
  tokenId;
  status;

  // NEW FILTERS TO ADD
  //  tree_associated
  //  tree_id
  //  tag
  //  token
  //  sort: { order: string, order_by: string };

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

    if (this.startDate) {
      where.startDate = this.startDate;
    }

    if (this.endDate) {
      where.endDate = this.endDate;
    }

    if (this.device_identifier) {
      where.device_identifier = this.device_identifier;
    }

    if (this.wallet) {
      where.wallet = this.wallet;
    }

    if (this.species_id === SPECIES_NOT_SET || this.species_id === null) {
      where.species_id = null;
    } else if (this.species_id === SPECIES_ANY_SET) {
      where.species_id = 'not null';
    } else if (this.species_id !== ALL_SPECIES) {
      where.species_id = this.species_id;
    }

    if (this.tag_id === TAG_NOT_SET || this.tag_id === null) {
      where.tag_id = null;
    } else if (this.tag_id === ANY_TAG_SET) {
      where.tag_id = 'not null';
    } else if (this.tag_id !== ALL_TAGS) {
      where.tag_id = this.tag_id;
    }

    if (
      this.organization_id === ORGANIZATION_NOT_SET ||
      (Array.isArray(this.organization_id) &&
        this.organization_id[0] === ORGANIZATION_NOT_SET)
    ) {
      where.organization_id = null;
    } else {
      where.organization_id = this.organization_id;
    }

    if (this.status) {
      where.status = this.status;
    }

    if (this.grower_account_id) {
      where.grower_account_id = this.grower_account_id;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      where.tokenized =
        this.tokenId === tokenizationStates.TOKENIZED ? 'true' : 'false';
    } else {
      delete where.tokenized;
    }

    let orCondition = false;
    const { ...restFilter } = where;

    // log.debug('FILTER MODEL', this, where);

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
    if (this.status !== undefined && this.status !== element.status) {
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

    if (this.status) {
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

    if (this.device_identifier) {
      numFilters += 1;
    }

    if (this.planter_id) {
      numFilters += 1;
    }

    if (this.planter_identifier) {
      numFilters += 1;
    }

    if (this.tag_id) {
      numFilters += 1;
    }

    if (this.startDate || this.endDate) {
      numFilters += 1;
    }

    // if there's an organization id and it's not an array of all ids
    if (this.organization_id && this.organization_id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.species_id && this.species_id !== ALL_SPECIES) {
      numFilters += 1;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      numFilters += 1;
    }

    if (this.grower_account_id) {
      numFilters += 1;
    }

    if (this.organization_id && this.organization_id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    // log.debug(
    //   'Count Filters ------------------',
    //   this.getWhereObj(),
    //   Object.keys(this.getWhereObj()).length,
    //   numFilters
    // );

    return numFilters;
  }
}
