const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const { find, findById, create, update, listTopicFollowers, listQuestions } = require('../controllers/topics')

const auth = require('../middlewares/jwt-auth')

// 获取所有话题
router.get('/', find)
// 新建一个话题
router.post('/', auth, create)
// 根据id获取具体的话题信息
router.get('/:id', findById)
// 更新某个话题
router.patch('/:id', auth, update)
// 获取某个话题的关注者列表
router.get('/:id/followers', listTopicFollowers)
// 获取某个话题的问题列表
router.get('/:id/questions', listQuestions)

module.exports = router
