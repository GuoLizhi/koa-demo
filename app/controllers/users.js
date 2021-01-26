const User = require('../models/users')
const jsonwebtoken = require('jsonwebtoken')
const Topic = require('../models/topics')
const Question = require('../models/questions')
const logger = require('../utils/log')

class UsersController {
  async getAll (ctx) {
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const pageNo = Math.max(+ctx.query.pageNo - 1, 0)
    try {
      ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
        .limit(pageSize)
        .skip(pageNo * pageSize)
    } catch (err) {
      logger.error(err)
      ctx.throw(404, '查询用户信息失败!')
    }
  }

  async getById (ctx) {
    const { fields } = ctx.query
    const selectFields = fields.split(';').filter(Boolean).map(field => ` +${field}`).join('')
    const populateStr = fields.split(';')
      .filter(Boolean)
      .map(field => {
        if (field === 'employments') {
          return 'employments.company employments.job'
        }
        if (field === 'educations') {
          return 'educations.school educations.major'
        }
        return field
      })
    const id = ctx.params.id
    try {
      ctx.body = await User.findById(id)
        .select(selectFields)
        .populate(populateStr)
    } catch (err) {
      logger.error(err)
      ctx.throw(404, '查询用户信息失败!')
    }
  }

  async create (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const { name } = ctx.request.body
    const repeat = await User.findOne({ name })
    if (repeat) ctx.throw(409, '用户已经存在')
    const user = new User(ctx.request.body)
    await user.save()
    ctx.body = ctx.request.body
  }

  async update (ctx) {
    const id = ctx.params.id
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatarUrl: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      }
    })
    await User.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = ctx.request.body
  }

  async del (ctx) {
    const id = ctx.params.id
    const user = await User.findByIdAndRemove(id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.status = 204
  }

  // 监测要操作的用户是否是当前用户
  async checkOwner (ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名密码不正确')
    const token = jsonwebtoken.sign({
      _id: user._id,
      name: user.name
    }, process.env.JWt_SECRET, { expiresIn: '1d' })
    ctx.body = { token }
  }

  async listFollowing (ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  async follow (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  async unfollow (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  async listFollowers (ctx) {
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }

  async checkUserExist (ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  // 用户关注话题
  async followTopic (ctx) {
    const me = await User.findById(ctx.state.user._id)
      .select('+followingTopics')
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      await me.save()
    }
    ctx.status = 204
  }

  /**
   * 用户取关话题
   */
  async unfollowTopic (ctx) {
    const me = await User.findById(ctx.state.user._id)
      .select('+followingTopics')
    const index = me.followingTopics
      .map(id => id.toString())
      .indexOf(ctx.params.id)
    if (index > -1) {
      me.followingTopics.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }

  /**
   * 检测话题是否存在 中间件
   */
  async checkTopicExist (ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }

  /**
   * 查询用户关注的话题
   */
  async listFollowingTopics (ctx, next) {
    const user = await User.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.followingTopics
  }

  // 列出本用户所有的提问
  async listQuestions (ctx) {
    const questions = await Question.find({ questioner: ctx.params.id })
    ctx.body = questions
  }
}

module.exports = new UsersController()
