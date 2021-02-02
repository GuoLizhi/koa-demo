const Router = require('koa-router')
const { createComment, getAllComments, checkCommentExist, getCommentById, checkCommentator, updateComment, delComment } = require('../controllers/comments')
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })
const auth = require('../middlewares/jwt-auth')

// 新建一条评论
router.post('/', auth, createComment)
// 某个问题下的所有评论
router.get('/', getAllComments)
// 根据评论id获取评论的具体信息
router.get('/:id', checkCommentExist, getCommentById)
// 更新评论
router.patch('/:id', auth, checkCommentExist, checkCommentator, updateComment)
// 删除评论
router.delete('/:id', auth, checkCommentExist, checkCommentator, delComment)

module.exports = router
