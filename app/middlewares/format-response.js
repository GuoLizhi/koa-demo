const { get } = require('lodash')
const { accessLogger } = require('../utils/log')

class Response {
  constructor (code, data, message) {
    this.code = code
    this.data = data
    this.message = message
  }
}
const errMap = {
  401: '请先登录！'
}
module.exports = function (ctx) {
  const { status, body = {} } = ctx
  if ([200, 204].includes(status)) {
    return new Response(`RP00${status}`, body, '请求成功')
  } else {
    const message = errMap[status] || body.message || '系统繁忙，请稍后重试！'
    accessLogger.error({
      message,
      userId: get(ctx, 'state.user._id') || '未登录'
    })
    return new Response(`RP00${status}`, null, message)
  }
}
