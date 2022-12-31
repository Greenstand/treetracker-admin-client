/*
 * A simple model for grower filter
 */

export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';

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
    } else if (this.organization_id !== ALL_ORGANIZATIONS) {
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

    return where;
  }

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    if (this.organization_id) {
      return Object.keys(this.getWhereObj()).length;
    }
  }
}
