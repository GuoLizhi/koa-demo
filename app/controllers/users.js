const db = []
const User = require('../models/users')
const jsonwebtoken = require('jsonwebtoken')


class UsersController {
  async getAll(ctx) {
    ctx.body = await User.find()
  }

  async getById(ctx) {
    const id = ctx.params.id
    ctx.body = await User.findById(id)
  }

  async create(ctx) {
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

  async update(ctx) {
    const id = ctx.params.id
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      }
    })
    await User.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = ctx.request.body
  }

  async del(ctx) {
    const id = ctx.params.id
    const user = await User.findByIdAndRemove(id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.status = 204
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async login(ctx) {
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
    ctx.body = {token}
  }
}

module.exports = new UsersController()
