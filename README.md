# express-logger-middleware

## log example
```
{"message":{"ip":"::ffff:192.168.48.1","ips":[],"path":"/","method":"GET","protocol":"http","params":{},"query":{"test":"test","test1":"test"},"elapsed":"2,008ms","requestId":"68f7d2a2-c9c9-42e3-bca9-3cba80b45807"},"containerId":"b7b60c1ff436","nodeVersion":"12.15.0","level":30,"sLevel":"INFO","@timestamp":"2020-05-27T11:12:48+09:00"}
```

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
  requestContextHelper,
} = require('@k-o/express-logger-middleware')

// create logger
const logger = new ECSContextLogger({ timeZone: 'Asia/Tokyo' });

// register functions
app.use(requestContextHelper());
app.use(loggingRequest(logger));
```

### Use logger
```javascript
const logger = new ECSContextLogger({ timeZone: 'Asia/Tokyo' });

logger.info('message!', {
  param: 'additional parameter',
});
```

available methods: `debug` `info` `error` `warn`



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
