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

    if (this.growerAccountUuid) {
      where.id = this.growerAccountUuid;
    }

    if (this.firstName) {
      where.first_name = this.firstName;
    }

    if (this.lastName) {
      where.last_name = this.lastName;
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organization_id = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organization_id = this.organizationId;
    }

    if (this.deviceIdentifier) {
      where.device_identifier = this.deviceIdentifier;
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
    if (this.organizationId) {
      return Object.keys(this.getWhereObj()).length;
    }
  }
}
