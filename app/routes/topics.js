const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const { find, findById, create, update, listTopicFollowers, listQuestions } = require('../controllers/topics')

const auth = jwt({
  secret: process.env.JWt_SECRET
})

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, update)
router.get('/:id/followers', listTopicFollowers)
router.get('/:id/questions', listQuestions)

module.exports = router
