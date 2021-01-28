const Router = require('koa-router')
const jwt = require('koa-jwt')
const { createComment, getAllComments, checkCommentExist, getCommentById, checkCommentator, updateComment, delComment } = require('../controllers/comments')
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })

const auth = jwt({ secret: process.env.JWT_KEY })

router.post('/', auth, createComment)
router.get('/', getAllComments)
router.get('/:id', checkCommentExist, getCommentById)
router.patch('/:id', auth, checkCommentExist, checkCommentator, updateComment)
router.delete('/:id', auth, checkCommentExist, checkCommentator, delComment)

module.exports = router
