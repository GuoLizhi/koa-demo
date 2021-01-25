const Router = require('koa-router')
const router = new Router({ prefix: '/questions' })
const jwt = require('koa-jwt')

const auth = jwt({
  secret: process.env.JWT_TOKEN
})
const { find, create, checkQuestionExist, findById, update, checkQuestioner, delete: del } = require('../controllers/questions')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkQuestionExist, findById)
router.patch('/:id', auth, checkQuestionExist, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router
