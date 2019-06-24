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
  let result = data;

  const dateTimeFrom = getFilterValue(req, 'LessonDateTimeFrom', '=');
  if (dateTimeFrom) {
    result = result.filter(lessonPresence =>
      sameDay(dateTimeFrom, lessonPresence.LessonDateTimeFrom)
    );
  }

  const confirmationStateId = getFilterValue(
    req,
    'PresenceConfirmationStateId',
    '='
  );
  if (confirmationStateId) {
    result = result.filter(
      lessonPresence =>
        lessonPresence.PresenceConfirmationStateId ===
        Number(confirmationStateId)
    );
  }

  return result;
}

module.exports = transformLessonPresences;
