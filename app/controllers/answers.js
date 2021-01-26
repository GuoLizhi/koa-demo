const Answer = require('../models/answers')

class AnswerController {
  // 查找某个问题下所有的答案
  async find (ctx) {
    const pageNo = Math.max(+ctx.query.pageNo, 1) - 1
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId })
      .limit(pageSize)
      .skip(pageSize * pageNo)
  }

  async checkAnswerExist (ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) ctx.throw(404, '答案不存在')
    if (answer.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此答案')
    ctx.state.answer = answer
    await next()
  }

  // 寻找特定答案
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';')
      .filter(Boolean)
      .map(field => ` +${field}`)
      .join('')
    const answer = await Answer.findById(ctx.params.id)
      .select(selectFields)
      .populate('answerer')
    ctx.body = answer
  }

  // 创建一个答案
  async create (ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      }
    })
    const answer = await new Answer({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId
    }).save()
    ctx.status = answer
  }

  // 检查回答者
  async checkAnswerer (ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  // 更新一个回答
  async update (ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: false
      }
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  // 删除一个回答
  async delete (ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new AnswerController()
