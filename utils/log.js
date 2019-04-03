const path = require('path');
const log4js = require('koa-log4');

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      pattern: '-YYYY-MM-DD.log',
      filename: path.join('logger', 'access.log'),
    },
    application: {
      type: 'dateFile',
      pattern: '-YYYY-MM-DD.log',
      filename: path.join('logger', 'access.log'),
    },
    out: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info',
    },
    access: {
      appenders: ['out', 'access'],
      level: 'info',
    },
    application: {
      appenders: ['application'],
      level: 'warn',
    },
  },
});

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
exports.warn = log4js.getLogger('application');
