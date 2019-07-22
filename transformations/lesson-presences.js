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

      const WasAbsentInPrecedingLesson =
        rest.LessonRef.Id === 6785567 &&
        [37665, 39059].includes(rest.StudentRef.Id)
          ? 1
          : undefined;

      const dispensationPresenceTypes = [14, 19, 21];
      const dispensatedStudents = [38332, 37524, 39361];
      const PresenceTypeRef =
        rest.LessonRef.Id === 6785473 &&
        dispensatedStudents.includes(rest.StudentRef.Id)
          ? {
              Id:
                dispensationPresenceTypes[
                  dispensatedStudents.indexOf(rest.StudentRef.Id)
                ],
              Href: `/PresenceTypes/${
                dispensationPresenceTypes[
                  dispensatedStudents.indexOf(rest.StudentRef.Id)
                ]
              }`
            }
          : rest.PresenceTypeRef;

      return {
        ...rest,
        LessonDateTimeFrom: adjustDateTime(LessonDateTimeFrom),
        LessonDateTimeTo: adjustDateTime(LessonDateTimeTo),
        PresenceDate: adjustDate(PresenceDate),
        WasAbsentInPrecedingLesson,
        PresenceTypeRef
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

  const confirmationStateId = getFilterValue(req, 'ConfirmationStateId', '=');
  if (confirmationStateId) {
    result = result.filter(
      lessonPresence =>
        lessonPresence.PresenceConfirmationStateId ===
        Number(confirmationStateId)
    );
  }

  const absencePresenceTypeId = getFilterValue(req, 'TypeRef', '=');
  if (absencePresenceTypeId) {
    result = result.filter(lessonPresence =>
      lessonPresence.PresenceTypeRef
        ? lessonPresence.PresenceTypeRef.Id === Number(absencePresenceTypeId)
        : false
    );
  }

  const hasStudyCourseConfirmationCode = getFilterValue(
    req,
    'HasStudyCourseConfirmationCode',
    '='
  );
  if (hasStudyCourseConfirmationCode) {
    result = result.filter(
      lessonPresence =>
        lessonPresence.HasStudyCourseConfirmationCode ===
        (hasStudyCourseConfirmationCode === true ? 1 : 0)
    );
  }

  return result;
}

module.exports = transformLessonPresences;
