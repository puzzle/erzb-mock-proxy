const { adjustDateTime, adjustDate, sameDay } = require('../utils/date');
const { getFilterValue } = require('../utils/filter');

function transformLessonPresences(req, data) {
  return filterLessonPresences(
    req,
    data.map(lessonPresence => {
      const {
        LessonDateTimeFrom,
        LessonDateTimeTo,
        PresenceDate,
        ...rest
      } = lessonPresence;
      return {
        ...rest,
        LessonDateTimeFrom: adjustDateTime(LessonDateTimeFrom),
        LessonDateTimeTo: adjustDateTime(LessonDateTimeTo),
        PresenceDate: adjustDate(PresenceDate)
      };
    })
  );
}

function filterLessonPresences(req, data) {
  const lessonDateTimeFromFilter = getFilterValue(
    req,
    'LessonDateTimeFrom',
    '='
  );
  if (lessonDateTimeFromFilter) {
    return data.filter(lessonPresence =>
      sameDay(lessonDateTimeFromFilter, lessonPresence.LessonDateTimeFrom)
    );
  }
  return data;
}

module.exports = transformLessonPresences;
