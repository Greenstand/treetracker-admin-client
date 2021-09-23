/**
 * @function
 * @name stringToSearchRegExp
 * @description Converts a string to a case-insesnsitive regular expression
 *              that can be used to search for string patterns.
 * @param {String} value
 * @returns {string} A regular expression string
 */
const stringToSearchRegExp = (value) => `/.*${value}.*/i`;

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
        regexp: stringToSearchRegExp(this.firstName),
      };
    }

    if (this.lastName) {
      where.lastName = {
        regexp: stringToSearchRegExp(this.lastName),
      };
    }

    if (this.organizationId) {
      where.organizationId = this.organizationId;
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
}
