const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');

const PORT = process.env.PORT || 3000;
const MOCK_API_URL = process.env.MOCK_API_URL;

if (!MOCK_API_URL) {
  console.log('No MOCK_API_URL environment variable defined, aborting.');
  process.exit();
}

const transformations = {
  '/LessonPresences': require('./transformations/lesson-presences')
};

const app = express();

app.use(
  proxy(MOCK_API_URL, {
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      const { pathname } = url.parse(userReq.url);
      if (Object.keys(transformations).includes(pathname)) {
        const input = JSON.parse(proxyResData);
        const output = transformations[pathname](userReq, input);
        return JSON.stringify(output);
      }
      return proxyResData;
    }
  })
);

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT} ...`)
);
