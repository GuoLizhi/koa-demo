const Question = require('../models/questions')

class QuestionController {
  // 查询所有的问题列表
  async find (ctx) {
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const pageNo = Math.max(+ctx.query.pageNo - 1, 0)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Question.find({
      $or: [{ title: q }, { description: q }]
    }).limit(pageSize).skip(pageSize * pageNo)
  }

  // 检测提问者是否存在
  async checkQuestionExist (ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) ctx.throw(404, '问题不存在')
    // 状态临时存储
    ctx.state.question = question
    await next()
  }

  // 检测问题的提问者是否为当前登录用户
  async checkQuestioner (ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  // 根据问题id查找具体的问题信息
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';')
      .filter(Boolean)
      .map(field => ` +${field}`)
      .join('')
    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner topics')
    ctx.body = question
  }

  // 创建一个问题
  async create (ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true
      },
      questioner: {
        type: 'string',
        required: true
      }
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
    ctx.body = question
  }

  // 更新一个问题
  async update (ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: false
      },
      description: {
        type: 'string',
        required: false
      }
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  // 删除一个问题
  async delete (ctx) {
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new QuestionController()
