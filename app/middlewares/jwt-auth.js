const jwt = require('koa-jwt')

module.exports = jwt({
  secret: process.env.JWt_SECRET
})
