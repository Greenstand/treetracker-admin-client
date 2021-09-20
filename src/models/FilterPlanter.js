/*
 * A simple model for planter filter
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
        ilike: this.firstName,
      };
    }

    if (this.lastName) {
      where.lastName = {
        ilike: this.lastName,
      };
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organizationId = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organizationId = this.organizationId;
    }

    if (this.email) {
      where.email = {
        ilike: this.email,
      };
    }

    if (this.phone) {
      where.phone = {
        ilike: this.phone,
      };
    }

    return where;
  }
}
