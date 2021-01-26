const path = require('path')
const log4js = require('log4js')

log4js.configure({
  appenders: {
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join(__dirname, '../logs/', 'application.log')
    }
  },
  categories: {
    default: {
      appenders: ['application'],
      level: 'error'
    }
  }
})

module.exports = log4js.getLogger('application')
