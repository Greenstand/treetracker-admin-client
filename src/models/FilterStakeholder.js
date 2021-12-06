// import { stringToSearchRegExp } from '../utilities';

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
    console.log('this', this);
    let where = {};

    if (this.type) {
      where.type = this.type;
    }

    if (this.name) {
      const [firstName, ...lastName] = this.name.split(' ');
      if (this.type === 'Person') {
        if (this.firstName) {
          where.firstName = firstName;
        }

        if (this.lastName) {
          where.lastName = lastName[0];
        }
        where.orgName = '';
      } else {
        // give all name fields the value for filter
        where.orgName = this.name;
        where.firstName = firstName || this.name;
        where.lastName = lastName[0] || this.name;
      }
    }

    if (this.id === ORGANIZATION_NOT_SET) {
      where.id = null;
    } else if (this.id !== ALL_ORGANIZATIONS) {
      where.id = this.id;
    }

    if (!this.stakeholder_uuid) {
      where.stakeholder_uuid = null;
    } else {
      where.stakeholder_uuid = this.stakeholder_uuid;
    }

    if (this.imageUrl) {
      where.imageUrl = this.imageUrl;
    } else {
      where.imageUrl = null;
    }

    if (this.email) {
      where.email = this.email;
    }

    if (this.phone) {
      where.phone = this.phone;
    }

    if (this.website) {
      where.website = this.website;
    } else {
      where.website = null;
    }

    if (this.logoUrl) {
      where.logoUrl = this.logoUrl;
    } else {
      where.logoUrl = null;
    }

    if (this.map) {
      where.map = this.map;
    } else {
      where.map = null;
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

    if (this.type) {
      numFilters += 1;
    }

    if (this.orgName) {
      numFilters += 1;
    }

    if (this.firstName) {
      numFilters += 1;
    }

    if (this.lastName) {
      numFilters += 1;
    }

    if (this.imageUrl) {
      numFilters += 1;
    }

    if (this.email) {
      numFilters += 1;
    }

    if (this.phone) {
      numFilters += 1;
    }

    if (this.website) {
      numFilters += 1;
    }

    if (this.logoUrl) {
      numFilters += 1;
    }

    if (this.map) {
      numFilters += 1;
    }

    if (this.id && this.id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.stakeholder_uuid) {
      numFilters += 1;
    }

    return numFilters;
  }
}