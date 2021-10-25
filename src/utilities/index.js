/**
 * @function
 * @name stringToSearchRegExp
 * @description Converts a string to a case-insensitive regular expression
 * that can be used to search for string patterns.
 *
 * @param {string} value The string to convert.
 * @returns {string} A regular expression string
 */
export const stringToSearchRegExp = (value) => `/.*${value}.*/i`;

/**
 * @function
 * @name getOrganizationById
 * @description gets an instance of organization from organization list
 * based on supplied organisation id
 *
 * @param {Array} organizations
 * @param {number} id
 *
 * @returns {object} found organization
 */
export const getOrganizationById = (organizations, organizationId) =>
  organizations.find(({ id }) => id === organizationId);
