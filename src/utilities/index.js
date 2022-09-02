import { format } from 'date-fns';

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

/**
 * @function
 * @name covertDateStringToHumanReadableFormat
 * @description receives a date iso string and converts it to a human readable format
 *
 * @param {string} dateString - date iso string to convert
 * @param {string} format - format to convert to
 * @link https://github.com/date-fns/date-fns - library used to convert date(follow link to see format options)
 *
 * @returns {string} human readable date
 */
export const convertDateStringToHumanReadableFormat = (
  dateString,
  fmt = 'eeee, MMM d, yyyy'
) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  return format(date, fmt);
};

/**
 * @function
 * @name generateActiveDateRangeFilterString
 * @description generate active date rage filter string e.g. 'Oct 1 - Oct 31'
 * @param {string} startDate - start date
 * @param {string} endDate - end date
 *
 * @returns {string} - active date range filter string
 */
export const generateActiveDateRangeFilterString = (startDate, endDate) => {
  const format = 'MMM d';

  const startDateString = convertDateStringToHumanReadableFormat(
    startDate,
    format
  );
  const endDateString = convertDateStringToHumanReadableFormat(endDate, format);

  return `${startDateString} - ${endDateString}`;
};
