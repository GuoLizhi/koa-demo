const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answer' })
const jwt = require('koa-jwt')

const auth = jwt({
  secret: process.env.JWT_TOKEN
})
const { find, create, checkAnswerExist, findById, update, checkAnswerer, delete: del } = require('../controllers/answers')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkAnswerExist, findById)
router.patch('/:id', auth, checkAnswerExist, update)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router
