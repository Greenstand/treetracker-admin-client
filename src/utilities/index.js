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
