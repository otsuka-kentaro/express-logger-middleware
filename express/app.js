const express = require('express')
const loggingRequest = require('@k-o/express-logger-middleware').loggingRequest
const app = express()
const port = 3000

app.use(loggingRequest({ timeZone: 'Asia/Tokyo' }));
app.get('/', (_req, res) => res.send('Hello World!'));
app.get('/exception', (_req, _res) => {
  throw 'exception!'
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
