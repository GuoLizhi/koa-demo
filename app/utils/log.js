const path = require('path')
const log4js = require('log4js')

log4js.configure({
  appenders: {
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join(__dirname, '../logs/', 'application.log')
    },
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join(__dirname, '../logs/', 'access.log')
    }
  },
  categories: {
    default: {
      appenders: ['application'],
      level: 'error'
    },
    access: {
      appenders: ['access'],
      level: 'error'
    }
  }
})

exports.logger = log4js.getLogger('application')
exports.accessLogger = log4js.getLogger('access')
