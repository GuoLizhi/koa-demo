// 将url中所需要查询的字段解析出来
module.exports = function (fields) {
  return fields.split(';')
    .filter(Boolean)
    .map(field => ` +${field}`)
    .join('')
}
