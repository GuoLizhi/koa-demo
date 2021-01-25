require('dotenv').config()
const Koa = require('koa')
const path = require('path')
const koaBody = require('koa-body') // 获取请求体body
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaStatic = require('koa-static')
const genRoutes = require('./routes')

const app = new Koa()

function formatError (err) {
  return {
    status: err.status,
    message: err.message,
    success: false
  }
}

parameter(app)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error(formatError))
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))
genRoutes(app)
app.listen(3000)
