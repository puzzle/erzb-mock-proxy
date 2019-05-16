const express = require("express");
const proxy = require("express-http-proxy");
const url = require("url");
const dateFns = require("date-fns");

const PORT = 3000;
const MOCK_API_URL =
  process.env.MOCK_API_URL;
const REFERENCE_DATE = new Date(2019, 3, 25, 0, 0, 0);
const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mmHss";
const DATE_FORMAT = "YYYY-MM-DD";

if (!MOCK_API_URL) {
  console.log('No MOCK_API_URL environment variable defined, aborting.')
  process.exit();
}

const transformations = {
  "/LessonPresences": transformLessonPresences
};

const app = express();

app.use(
  proxy(MOCK_API_URL, {
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      const { pathname } = url.parse(userReq.url);
      if (Object.keys(transformations).includes(pathname)) {
        const input = JSON.parse(proxyResData);
        const output = transformations[pathname](input);
        return JSON.stringify(output);
      }
      return proxyResData;
    }
  })
);

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT} ...`)
);

function transformLessonPresences(data) {
  return data.map(lessonPresence => {
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
  });
}

function adjustDateTime(dateTimeStr) {
  const dateTime = dateFns.parse(dateTimeStr);
  const diff = dateFns.differenceInDays(new Date(), REFERENCE_DATE);
  return dateFns.format(dateFns.addDays(dateTime, diff), DATE_TIME_FORMAT);
}

function adjustDate(dateStr) {
  const dateTime = dateFns.parse(dateStr);
  const diff = dateFns.differenceInDays(new Date(), REFERENCE_DATE);
  return dateFns.format(dateFns.addDays(dateTime, diff), DATE_FORMAT);
}
