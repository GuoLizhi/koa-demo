const Router = require('koa-router')
const router = new Router({ prefix: '/questions' })
const auth = require('../middlewares/jwt-auth')
const { find, create, checkQuestionExist, findById, update, checkQuestioner, delete: del } = require('../controllers/questions')

// 获取所有的问题
router.get('/', find)
// 新建一个问题
router.post('/', auth, create)
// 根据问题id获取特定的问题
router.get('/:id', checkQuestionExist, findById)
// 更新一个问题
router.patch('/:id', auth, checkQuestionExist, update)
// 删除一个问题
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router
