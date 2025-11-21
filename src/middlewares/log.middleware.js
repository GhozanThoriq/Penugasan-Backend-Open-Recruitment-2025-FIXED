// src/middlewares/log.middleware.js
const expressWinston = require('express-winston');
const logger = require('../config/logger.js');

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  colorize: false,
  expressFormat: true,
  ignoreRoute: function (req, res) { return false; x}
});

// error logger
const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger
});

module.exports = { requestLogger, errorLogger };
