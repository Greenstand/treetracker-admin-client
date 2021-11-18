import { stringToSearchRegExp } from '../utilities';

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
      where.personId = this.personId;
    }

    if (this.id) {
      where.id = this.id;
    }

    if (this.firstName) {
      where.firstName = {
        regexp: stringToSearchRegExp(this.firstName),
      };
    }

    if (this.lastName) {
      where.lastName = {
        regexp: stringToSearchRegExp(this.lastName),
      };
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organizationId = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organizationId = this.organizationId;
    }

    if (this.deviceIdentifier) {
      where.deviceIdentifier = this.deviceIdentifier;
    } else {
      where.deviceIdentifier = null;
    }

    if (this.email) {
      where.email = {
        regexp: stringToSearchRegExp(this.email),
      };
    }

    if (this.phone) {
      where.phone = {
        regexp: stringToSearchRegExp(this.phone),
      };
    }

    return where;
  }

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.id) {
      numFilters += 1;
    }

    if (this.personId) {
      numFilters += 1;
    }

    if (this.deviceIdentifier) {
      numFilters += 1;
    }

    if (this.firstName) {
      numFilters += 1;
    }

    if (this.lastName) {
      numFilters += 1;
    }

    if (this.email) {
      numFilters += 1;
    }

    if (this.phone) {
      numFilters += 1;
    }

    if (this.organizationId && this.organizationId !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    return numFilters;
  }
}
