const express = require('express')
const {
  ECSContextLogger,
  loggingRequest,
  requestContextHelper,
} = require('@k-o/express-logger-middleware')
const app = express()
const port = 3000

const logger = new ECSContextLogger({ timeZone: 'Asia/Tokyo' });
app.use(requestContextHelper());
app.use(loggingRequest(logger));
app.get('/', (_req, res) => {
  setTimeout(() => {
    res.send('Hello World!');
  }, 2000);
});
app.get('/exception', (_req, _res) => {
  throw 'exception!'
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
