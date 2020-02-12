const express = require('express')
const {
  ECSContextLogger,
  loggingRequest,
  loggingResponse,
  requestContextHelper,
} = require('@k-o/express-logger-middleware')
const app = express()
const port = 3000

const logger = new ECSContextLogger({ timeZone: 'Asia/Tokyo' });
app.use(requestContextHelper());
app.use(loggingRequest(logger));
app.use(loggingResponse(logger));
app.get('/', (_req, res) => {
  res.send('Hello World!')
});
app.get('/exception', (_req, _res) => {
  throw 'exception!'
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
