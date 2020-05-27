const moment = require('moment-timezone')
const uuid = require('uuid')

// see also: https://github.com/trentm/node-bunyan#levels
const LogLevels = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60
}

const ECS_CONTEXT = {
  environment: process.env.NODE_ENV,
  containerId: process.env.HOSTNAME,
  nodeVersion: process.env.NODE_VERSION,
}


// copied from: https://github.com/getndazn/dazn-lambda-powertools/blob/12a87b75a3857946dcf78ca8edb438503bf36f19/packages/lambda-powertools-logger/index.js#L22-L132
// change DEFAULT_CONTEXT to ECS_CONTEXT
// remove CorrelationIds
class Logger {
  constructor({
    level = process.env.LOG_LEVEL,
    timeZone = null,
    timestampFormat = ''
  } = {}) {
    this.level = (level || 'DEBUG').toUpperCase();
    this.originalLevel = this.level;
    this.timestampFormat = timestampFormat;
    if (timeZone) {
      moment.tz.setDefault(timeZone);
    }

    if (this.isEnabled(LogLevels.DEBUG)) {
      try {
        console.debug(`logger created with following params\n  level:${this.level}\n  timeZone:${moment()._z.name}`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  get context() {
    return {
      ...ECS_CONTEXT,
    }
  }

  isEnabled(level) {
    return level >= (LogLevels[this.level] || LogLevels.DEBUG)
  }

  appendError(params, err) {
    if (!err) {
      return params
    }

    return {
      ...params || {},
      errorName: err.name,
      errorMessage: err.message,
      stackTrace: err.stack
    }
  }

  log(levelName, message, params) {
    const level = LogLevels[levelName]
    if (!this.isEnabled(level)) {
      return
    }

    const logMsg = {
      ...this.context,
      ...params,
      level,
      sLevel: levelName,
      '@timestamp': moment().format(this.timestampFormat),
      message
    }

    // re-order message and params to appear earlier in the log row
    console.log(JSON.stringify({ message, ...params, ...logMsg }))
  }

  debug(msg, params) {
    this.log('DEBUG', msg, params)
  }

  info(msg, params) {
    this.log('INFO', msg, params)
  }

  warn(msg, params, err) {
    const parameters = !err && params instanceof Error ? this.appendError({}, params) : this.appendError(params, err)
    this.log('WARN', msg, parameters)
  }

  error(msg, params, err) {
    const parameters = !err && params instanceof Error ? this.appendError({}, params) : this.appendError(params, err)
    this.log('ERROR', msg, parameters)
  }

  enableDebug() {
    this.level = 'DEBUG'
    return () => this.resetLevel()
  }

  resetLevel() {
    this.level = this.originalLevel
  }
}


exports.ECSContextLogger = Logger;
exports.LogLevels = LogLevels;

/**
 * Logging out express request.
 * Parameters are ip, ips, path, method, protocol, params, query
 * in json format.
 */
exports.loggingRequest = function(logger) {
  if (!logger || !(logger instanceof Logger)) {
    console.warn('[loggingRequest] logger was created with default options (logger does not specified)');
    logger = new Logger();
  }

  return function(req, res, next) {
    const start = Date.now();
    res.on('finish', function() {
      const elapsed = Date.now() - start;
      try {
        let data = {
          ip: req.ip,
          ips: req.ips,
          path: req.path,
          method: req.method,
          protocol: req.protocol,
          params: req.params,
          query: req.query,
          elapsed: elapsed.toLocaleString() + 'ms',
        };
        // set request context id
        if (req.id) {
          data['requestId'] = req.id;
        }
        logger.info(data)
      } catch (e) {
        // guard unexpected error
        console.error(e);
      }
    });

    next();
  }
}

/**
 * Add request identify string (UUID v4 string) to request object. (req.id = [UUID_V4])
 */
exports.requestContextHelper = function() {
  return function(req, _res, next) {
    try {
      req.id = uuid.v4();
    } catch (e) {
      // guard unexpected error
      console.error(e);
    }

    next();
  }
}
