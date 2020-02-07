const express = require('express')
const loggingRequest = require('@k-o/express-logger-middleware').loggingRequest
const app = express()
const port = 3000

app.use(loggingRequest({ level: 'trace', timeZone: 'Asia/Tokyo' }))
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
