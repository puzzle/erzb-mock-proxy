const dateFns = require('date-fns');

const REFERENCE_DATE = new Date(2019, 3, 25, 0, 0, 0);
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mmHss';
const DATE_FORMAT = 'YYYY-MM-DD';

function adjustDateTime(dateTimeStr) {
  const dateObj = dateFns.parse(dateTimeStr);
  const diff = dateFns.differenceInDays(new Date(), REFERENCE_DATE);
  return dateFns.format(dateFns.addDays(dateObj, diff), DATE_TIME_FORMAT);
}

function adjustDate(dateStr) {
  const dateObj = dateFns.parse(dateStr);
  const diff = dateFns.differenceInDays(new Date(), REFERENCE_DATE);
  return dateFns.format(dateFns.addDays(dateObj, diff), DATE_FORMAT);
}

function sameDay(dateStr, date) {
  const dateObj = dateFns.parse(dateStr);
  return dateFns.isSameDay(date, dateStr);
}

module.exports = {
  REFERENCE_DATE,
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  adjustDateTime,
  adjustDate,
  sameDay
};
