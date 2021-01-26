class Response {
  constructor (code, data, message) {
    this.code = code
    this.data = data
    this.message = message
  }
}

module.exports = function (ctx) {
  const { status, body = {} } = ctx
  if ([200, 204].includes(status)) {
    return new Response(`RP00${status}`, body, '请求成功')
  } else {
    const errMsg = {
      401: '请先登录！'
    }
    return new Response(`RP00${status}`, null, errMsg[status] || body.message || '系统繁忙，请稍后重试！')
  }
}
