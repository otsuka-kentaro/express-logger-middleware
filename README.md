# express-logger-middleware

## Setup
```bash
$ cp .env.default .env
$ docker-compose build
```

## add package
```bash
$ docker run --rm -v $PWD:/app -w /app node:12.15.0-alpine npm install [package_name]
$ docker-compose run --rm express npm install [package_name]
$ docker-compose build
$ docker-compose rm -v
```
