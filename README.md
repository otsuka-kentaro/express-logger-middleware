# express-logger-middleware

## express application

First of all, add package to your project.
```bash
$ npm install @k-o/express-logger-middleware
```

Register function to your express app.
```javascript
const app = express() // your app

// import middleware
const {
  ECSContextLogger,
  loggingRequest,
  loggingResponse,
  requestContextHelper,
} = require('@k-o/express-logger-middleware')

// create logger
const logger = new ECSContextLogger({ timeZone: 'Asia/Tokyo' });

// register functions
app.use(requestContextHelper());
app.use(loggingRequest(logger));
app.use(loggingResponse(logger));
```

## For developing
### Setup
```bash
$ cp .env.default .env
$ docker-compose build
```

### add package
```bash
$ docker run --rm -v $PWD:/app -w /app node:12.15.0-alpine npm install [package_name]
$ docker-compose run --rm express npm install [package_name]
$ docker-compose build
$ docker-compose rm -v
```

### deploy
```bash
$ npm publish
```
