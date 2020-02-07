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
    level = process.env.LOG_LEVEL
  } = {}) {
    this.level = (level || 'DEBUG').toUpperCase()
    this.originalLevel = this.level
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

  static debug(...args) {
    globalLogger.debug(...args)
  }

  static info(...args) {
    globalLogger.info(...args)
  }

  static warn(...args) {
    globalLogger.warn(...args)
  }

  static error(...args) {
    globalLogger.error(...args)
  }

  static enableDebug() {
    return globalLogger.enableDebug()
  }

  static resetLevel() {
    globalLogger.resetLevel()
  }

  static get level() {
    return globalLogger.level
  }
}


exports.ECSContextLogger = Logger;
exports.LogLevels = LogLevels;

exports.loggingRequest = function(logLevel = 'DEBUG') {
  const logger = new Logger({ level: logLevel });

  return function(req, _, next) {
    try {
      logger.info({
        ip: req.ip,
        ips: req.ips,
        path: req.path,
        method: req.method,
        protocol: req.protocol,
        params: req.params,
        query: req.query,
      })
    } catch (e) {
      // guard unexpected error
      console.error(e);
    }

    next();
  }
}
