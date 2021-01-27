const Comment = require('../models/comments')

class CommentController {
  // 查询所有的评论
  async getAllComments (ctx) {
    const pageSize = Math.max(+ctx.query.pageSize, 1)
    const pageNo = Math.max(+ctx.query.pageNo - 1, 0)
    const q = new RegExp(ctx.query.q)
    const { questionId, answerId } = ctx.params
    ctx.body = await Comment.find({ content: q, questionId, answerId })
      .select('+commentator')
      .limit(pageSize)
      .skip(pageNo * pageSize)
      .populate('commentator')
  }

  // 检测答案是否存在
  async checkCommentExist (ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) ctx.throw(404, '答案不存在')
    if (ctx.params.questionId && ctx.params.questionId !== comment.questionId.toString()) {
      ctx.throw(404, '该问题下面没有此评论')
    }
    if (ctx.params.answerId && comment.answerId.toString() !== ctx.params.answerId) {
      ctx.throw(404, '该答案下面没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }

  // 通过评论id来查找相关的评论
  async getCommentById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';')
      .filter(Boolean)
      .map(field => ` +${field}`)
      .join('')
    const comment = await Comment.findById(ctx.params.id)
      .select(selectFields)
      .populate('commentator questionId answerId')
    ctx.body = comment
  }

  // 创建一个评论
  async createComment (ctx) {
    ctx.verifyParams({
      content: {
        type: 'string',
        required: true
      },
      rootCommentId: {
        type: 'string',
        required: false
      },
      replyTo: {
        type: 'string',
        required: false
      }
    })
    const commentator = ctx.state.user._id
    const { questionId, answerId } = ctx.params
    const comment = await new Comment({
      ...ctx.request.body,
      answerId,
      questionId,
      commentator
    }).save()
    ctx.body = comment
  }

  // 更新一条评论
  async updateComment (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const { content } = ctx.request.body
    await ctx.state.comment.update({ content })
    ctx.body = ctx.state.comment
  }

  // 删除一条评论
  async delComment (ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

  // 检查操作者是否有权限
  async checkCommentator (ctx, next) {
    const { comment } = ctx.state
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
}

module.exports = new CommentController()
