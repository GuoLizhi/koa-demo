require('dotenv').config()
const Koa = require('koa')
const path = require('path')
const koaBody = require('koa-body') // 获取请求体body
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaStatic = require('koa-static')
const genRoutes = require('./routes')
const setResponse = require('./middlewares/format-response')

const app = new Koa()

// 响应格式化中间件
async function formatResponse (ctx, next) {
  await next()
  if (!/\/uploads\/upload_/.test(ctx.path)) {
    ctx.body = setResponse(ctx)
  }
}

// 错误格式化中间件
function formatError (err) {
  return {
    status: err.status,
    message: err.message,
    success: false
  }
}

app.use(formatResponse)
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
