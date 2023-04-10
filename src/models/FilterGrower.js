/*
 * A simple model for grower filter
 */

export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';
export const ANY_CAPTURES_AMOUNT = 'ANY_CAPTURES_AMOUNT_SET';
// import log from 'loglevel';

export default class Filter {
  constructor(options) {
    Object.assign(this, options);
  }
  getWhereObj() {
    let where = {};

    if (this.personId) {
      where.person_id = this.personId;
    }

    if (this.wallet) {
      where.wallet = this.wallet;
    }

    if (this.id) {
      where.id = this.id;
    }

    if (this.grower_account_id) {
      where.id = this.grower_account_id;
    }

    if (this.firstName) {
      where.first_name = this.firstName;
    }

    if (this.lastName) {
      where.last_name = this.lastName;
    }

    if (this.organization_id === ORGANIZATION_NOT_SET) {
      where.organization_id = null;
    } else {
      where.organization_id = this.organization_id;
    }

    if (this.device_identifier) {
      where.device_identifier = this.device_identifier;
    }

    if (this.email) {
      where.email = this.email;
    }

    if (this.phone) {
      where.phone = this.phone;
    }

    if (this.capturesAmount_range && !isNaN(this.capturesAmount_range.min)) {
      where.captures_amount_min = this.capturesAmount_range.min;
    }

    if (this.capturesAmount_range && !isNaN(this.capturesAmount_range.max)) {
      where.captures_amount_max = this.capturesAmount_range.max;
    }

    return where;
  }

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.status) {
      numFilters += 1;
    }

    if (this.personId) {
      numFilters += 1;
    }

    if (this.wallet) {
      numFilters += 1;
    }

    if (this.id) {
      numFilters += 1;
    }

    if (this.grower_account_id) {
      numFilters += 1;
    }

    if (this.firstName) {
      numFilters += 1;
    }

    if (this.lastName) {
      numFilters += 1;
    }

    // if there's an organization id and it's not an array of all ids
    if (this.organization_id && this.organization_id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.device_identifier) {
      numFilters += 1;
    }

    if (this.email) {
      numFilters += 1;
    }

    if (this.phone) {
      numFilters += 1;
    }

    if (
      this.capturesAmount_range &&
      this.capturesAmount_range !== ANY_CAPTURES_AMOUNT
    ) {
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
