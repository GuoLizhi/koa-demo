const Topic = require('../models/topics')
const User = require('../models/users')

class TopicController {
  // 获取所有的主题
  async find (ctx) {
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const pageNo = Math.max(+ctx.query.pageNo - 1, 0)
    // 模糊搜索
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
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

  // 获取一个话题所有的粉丝
  async listTopicFollowers (ctx) {
    const users = await User.find({
      followingTopics: ctx.params.id
    })
    ctx.body = users
  }
}

module.exports = new TopicController()
