const User = require('../models/users')
const jsonwebtoken = require('jsonwebtoken')
const Topic = require('../models/topics')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const { logger } = require('../utils/log')
const handleFields = require('../utils/handle-fields')

class UsersController {
  // 获取所有用户，支持分页查询
  async getAllUser (ctx) {
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

  // 通过用户id来查询用户，支持按字段查询
  async getUserById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = handleFields(fields)
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

  // 用户注册
  async register (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeat = await User.findOne({ name })
    if (repeat) ctx.throw(409, '用户已经存在')
    try {
      const user = new User(ctx.request.body)
      await user.save()
      ctx.body = ctx.request.body
    } catch (err) {
      console.log(err)
      logger.error(err)
      ctx.throw(500, '用户注册失败!')
    }
  }

  async updateUser (ctx) {
    const id = ctx.params.id
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatarUrl: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
      following: { type: 'array', itemType: 'string', required: false },
      followingTopics: { type: 'array', itemType: 'string', required: false },
      likingAnswers: { type: 'array', itemType: 'string', required: false },
      dislikingAnswers: { type: 'array', itemType: 'string', required: false },
      collectingAnswers: { type: 'array', itemType: 'string', required: false }
    })
    try {
      await User.findByIdAndUpdate(id, ctx.request.body)
      ctx.body = ctx.request.body
    } catch (err) {
      logger.error(err)
      ctx.throw(500, '更新用户失败')
    }
  }

  // 删除用户
  async delUser (ctx) {
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

  // 用户登录
  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名密码不正确')
    // 生成token
    const token = jsonwebtoken.sign({
      _id: user._id,
      name: user.name
    }, process.env.JWt_SECRET, { expiresIn: '1d' })
    ctx.body = { token }
  }

  // 列出某个用户的粉丝
  async listFollowing (ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    if (!user) {
      ctx.throw(404, '该用户没有粉丝')
    }
    ctx.body = user.following
  }

  // 关注其他人
  async follow (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      await me.save()
    }
    ctx.status = 204
  }

  // 取消关注
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

  // 列出用户点赞列表
  async listLikingAnswers (ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+likingAnswers')
      .populate('likingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.likingAnswers
  }

  // 用户点赞
  async likeAnswer (ctx, next) {
    const me = await User.findById(ctx.state.user._id)
      .select('+likingAnswers')
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id)
      await me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: { voteCount: 1 }
      })
    }
    ctx.status = 204
    await next()
  }

  // 用户取消点赞
  async unlikeAnswer (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.likingAnswers.splice(index, 1)
      await me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: { voteCount: -1 }
      })
    }
    ctx.status = 204
  }

  // 列出用户踩列表
  async listDislikingAnswers (ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+dislikingAnswers')
      .populate('dislikingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.dislikingAnswers
  }

  // 用户踩
  async dislikeAnswer (ctx, next) {
    const me = await User.findById(ctx.state.user._id)
      .select('+dislikingAnswers')
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id)
      await me.save()
    }
    ctx.status = 204
    await next()
  }

  // 用户取消踩
  async undislikeAnswer (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }

  // 列出用户收藏列表
  async listCollectingAnswers (ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+collectingAnswers')
      .populate('collectingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.collectingAnswers
  }

  // 用户收藏答案
  async collectAnswer (ctx, next) {
    const me = await User.findById(ctx.state.user._id)
      .select('+collectingAnswers')
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id)
      await me.save()
    }
    ctx.status = 204
    await next()
  }

  // 用户取消收藏答案
  async uncollectAnswer (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.collectingAnswers.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }
}

module.exports = new UsersController()
