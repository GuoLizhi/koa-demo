const Topic = require('../models/topics')

class TopicController {
  // 获取所有的主题
  async find (ctx) {
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const pageNo = Math.max(+ctx.query.pageNo - 1, 0)
    ctx.body = await Topic.find()
      .limit(pageSize)
      .skip(pageNo * pageSize)
  }

  // 获取指定主题
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';')
      .filter(Boolean)
      .map(field => ` +${field}`)
      .join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }

  // 创建一个话题
  async create (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      avatarUrl: {
        type: 'string',
        required: false
      },
      introduction: {
        type: 'string',
        required: false
      }
    })
    const topic = new Topic(ctx.request.body)
    await topic.save()
    ctx.body = topic
  }

  // 修改一个话题
  async update (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      avatarUrl: {
        type: 'string',
        required: false
      },
      introduction: {
        type: 'string',
        required: false
      }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = Object.assign(topic, ctx.request.body)
  }
}

module.exports = new TopicController()
