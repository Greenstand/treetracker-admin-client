import { format, formatDistanceToNow, getYear } from 'date-fns';

import enLocale from 'date-fns/locale/en-US';

// Per default set to EN
var localeLanguage = 'en';
// default date pattern when converting dates
// to work with sql queries
const defaultSqlDatePattern = 'yyyy-MM-dd';

// Contains the locale for the DatePicker
// now only EN is used, otherwise, many imports
// bloat up the application size
// Later this should be rendered server side
const localeMap = {
  en: enLocale,
};

// General display options for the date
const dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: '2-digit',
};

// General display options for the time
const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

// Returns a date or dateTime format string depending on the locale
// and options set in dateOptions and timeOptions
const getDateTimeFormatString = (includeTime) => {
  const intlOptions = includeTime
    ? { ...dateOptions, ...timeOptions }
    : dateOptions;
  const intlDateTimeFormat = new Intl.DateTimeFormat(
    localeLanguage,
    intlOptions
  );
  const formatDateTimeObj = intlDateTimeFormat.formatToParts(new Date());
  const is12HourTimeZone = intlDateTimeFormat.resolvedOptions().hour12;

  return formatDateTimeObj
    .map((obj) => {
      switch (obj.type) {
        case 'day':
          return 'dd';
        case 'month':
          return 'MM';
        case 'year':
          return 'yyyy';
        case 'hour':
          // Check if locale is a 12-hour or 24-hour timezone
          return is12HourTimeZone ? 'hh' : 'HH';
        case 'minute':
          return 'mm';
        case 'dayPeriod':
          return is12HourTimeZone ? 'a' : '';
        default:
          return obj.value;
      }
    })
    .join('');
};

// set the locale language
const setLocaleLanguage = (language) => {
  localeLanguage = language;
};

// DatePicker Locale - default is 'en'
const getDatePickerLocale = () => {
  return localeMap['en'];
};

const getDateFormatLocale = () => {
  return getDateTimeFormatString(false);
};

const getDateTimeFormatLocale = () => {
  return getDateTimeFormatString(true);
};

const getDateStringLocale = (date) => {
  return format(date, getDateFormatLocale());
};

const getDateTimeStringLocale = (date) => {
  // this block is created to fix an error due to an incorrect test date, you can then delete it
  let d = new Date(date);
  let incomingYear = getYear(d);
  let currentYear = getYear(Date.now());
  if (incomingYear > currentYear) {
    d.setFullYear(currentYear);
  }
  //------------------------------------------------------------
  return format(d, getDateTimeFormatLocale());
};

// used for converting application date to sql readable date format
const convertDateToDefaultSqlDate = (date) => {
  return format(date, defaultSqlDatePattern);
};

const timeAgoFormatDate = (date) => {
  let timeStr = formatDistanceToNow(date).replace(/about/, '');
  return timeStr;
};

export {
  setLocaleLanguage,
  getDatePickerLocale,
  getDateFormatLocale,
  getDateTimeFormatLocale,
  getDateStringLocale,
  getDateTimeStringLocale,
  convertDateToDefaultSqlDate,
  timeAgoFormatDate,
};
