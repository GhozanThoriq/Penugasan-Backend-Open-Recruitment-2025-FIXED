// src/config/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// pastikan folder log ada
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, meta }) => {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'app.log') }),
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) })
  ],
  exitOnError: false
});

module.exports = logger;
