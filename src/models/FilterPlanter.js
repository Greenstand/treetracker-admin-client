/*
 * A simple model for planter filter
 */

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

    if (this.organizationId) {
      where.organizationId = this.organizationId;
    }

    return where;
  }
}
