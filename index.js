const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');
const cache = require('apicache').middleware;
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const MOCK_API_URL = process.env.MOCK_API_URL;

if (!MOCK_API_URL) {
  console.log('No MOCK_API_URL environment variable defined, aborting.');
  process.exit();
}

const transformations = {
  '^/LessonPresences$': require('./transformations/lesson-presences'),
  '^/Students$': require('./transformations/students'),
  '^/Persons$': require('./transformations/persons'),
  '^/ApprenticeshipContracts$': require('./transformations/apprenticeship-contracts'),
  '^/Students/[0-9]+/LegalRepresentatives$': require('./transformations/legal-representatives')
};

const app = express();

app.use(cors({ origin: true }));

app.put('/BulkEditLessonPresence', (req, res) => res.status(200).send());
app.put('/BulkResetLessonPresence', (req, res) => res.status(200).send());
app.get('/Students/37435/ApprenticeshipContracts/Current', (req, res) =>
  res.status(404).send()
);
app.get('/Students/39361', (req, res) => res.status(404).send());

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
    const transformationKey = Object.keys(transformations).find(r =>
      new RegExp(r).test(pathname)
    );
    if (transformationKey) {
      const input = JSON.parse(proxyResData);
      const output = transformations[transformationKey](userReq, input);
      return JSON.stringify(output);
    }
    return proxyResData;
  }
});

app.use(cache('30 minutes'), proxyImages, proxyMockApi);

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT} ...`)
);
