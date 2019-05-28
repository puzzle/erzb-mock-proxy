const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');
const cache = require('apicache').middleware;

const PORT = process.env.PORT || 3000;
const MOCK_API_URL = process.env.MOCK_API_URL;

if (!MOCK_API_URL) {
  console.log('No MOCK_API_URL environment variable defined, aborting.');
  process.exit();
}

const transformations = {
  '/LessonPresences': require('./transformations/lesson-presences'),
  '/Students': require('./transformations/students')
};

const app = express();

app.post('/BulkEditLessonPresence', (req, res) => res.status(200).send());
app.post('/BulkResetLessonPresence', (req, res) => res.status(200).send());

const proxyImages = proxy('https://placeimg.com', {
  filter: (req, res) =>
    req.method == 'GET' &&
    /^\/Files\/personPictures\/[0-9]+$/.test(url.parse(req.url).pathname),
  proxyReqPathResolver: req => '/100/130/people',
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    // Return a 404 for 10% of the images
    if (Math.random() < 0.1) {
      userRes.status(404).contentType('text/html');
      return 'Image not found';
    }
    return proxyResData;
  }
});

const proxyMockApi = proxy(MOCK_API_URL, {
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const { pathname } = url.parse(userReq.url);
    if (Object.keys(transformations).includes(pathname)) {
      const input = JSON.parse(proxyResData);
      const output = transformations[pathname](userReq, input);
      return JSON.stringify(output);
    }
    return proxyResData;
  }
});

app.use(cache('30 minutes'), proxyImages, proxyMockApi);

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT} ...`)
);
