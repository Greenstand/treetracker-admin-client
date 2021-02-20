import enLocale from 'date-fns/locale/en-US';
import dateformat from 'dateformat'

// Per default set to EN
var localeLanguage = 'en';
// default date pattern when converting dates
// to work with sql queries
const defaultSqlDatePattern = 'yyyy-mm-dd';

// Contains the locale for the DatePicker
// now only EN is used, otherwise, many imports 
// bloat up the application size
// Later this should be rendered server side
const localeMap = {
  en: enLocale
};

// General display options for the date
const dateOptions = { 
  year: 'numeric', 
  month: 'numeric', 
  day: '2-digit'
};

// General display options for the time
const timeOptions = {
  hour: 'numeric', 
  minute: 'numeric' 
};

// Returns a date or dateTime format string depending on the locale
// and options set in dateOptions and timeOptions
const getDateTimeFormatString = (includeTime , forMuiDatepicker) => {
  const intlOptions = includeTime ? {...dateOptions, ...timeOptions} : dateOptions;
  const intlDateTimeFormat = new Intl.DateTimeFormat(localeLanguage, intlOptions);
  const formatDateTimeObj = intlDateTimeFormat.formatToParts(new Date());
  const is12HourTimeZone = intlDateTimeFormat.resolvedOptions().hour12;

  return formatDateTimeObj
    .map(obj => {
      switch (obj.type) {
        case 'day':
          return 'dd';
        case 'month':
          return forMuiDatepicker ? 'MM' : 'mm';
        case 'year':
          return 'yyyy';
        case 'hour':
          // Check if locale is a 12-hour or 24-hour timezone
          return is12HourTimeZone ? 'hh' : 'HH';
        case 'minute':
          return forMuiDatepicker ? 'mm' : 'MM';
        case 'dayPeriod':
          return is12HourTimeZone ? (forMuiDatepicker ? 'a' : 'tt') : '';
        default:
          return obj.value;
      }
    })
    .join("");
}

// set the locale language
const setLocaleLanguage = (language) => {
  localeLanguage = language;
}

// DatePicker Locale - default is 'en'
const getDatePickerLocale = () => {
  return localeMap['en'];
}

const getDateFormatLocale = (forMuiDatepicker = false) => {
  return getDateTimeFormatString(false, forMuiDatepicker);
}

const getDateTimeFormatLocale = (forMuiDatepicker = false) => {
  return getDateTimeFormatString(true, forMuiDatepicker);
}

const getDateStringLocale = (date, forMuiDatepicker = false) => {
  return dateformat(date, getDateFormatLocale(forMuiDatepicker));
}

const getDateTimeStringLocale = (date, forMuiDatepicker = false) => {
  return dateformat(date, getDateTimeFormatLocale(forMuiDatepicker));
}

// used for converting application date to sql readable date format
const convertDateToDefaultSqlDate = (date) => {
  return dateformat(date, defaultSqlDatePattern);
}

export {
  setLocaleLanguage,
  getDatePickerLocale,
  getDateFormatLocale,
  getDateTimeFormatLocale,
  getDateStringLocale,
  getDateTimeStringLocale,
  convertDateToDefaultSqlDate
}
