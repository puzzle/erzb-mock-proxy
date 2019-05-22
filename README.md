# erzb-mock-proxy

This is a proxy server used during development of the [erz-mba-fbi/absenzenmanagement](https://github.com/erz-mba-fbi/absenzenmanagement) project. It mocks additional behavior that is not provided by the Postman mock server like filtering, date transformations etc.

## Usage

Start it locally with the URL of the Postman API mock:

```
npm install
MOCK_API_URL=https://xyz.mock.pstmn.io npm start
```

And configure your frontend to use http://localhost:3000 as backend.
