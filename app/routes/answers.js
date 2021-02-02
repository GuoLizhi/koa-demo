const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answer' })
const auth = require('../middlewares/jwt-auth')
const { find, create, checkAnswerExist, findById, update, checkAnswerer, delete: del } = require('../controllers/answers')

// 获取某个问题下的答案列表
router.get('/', find)
// 新建一个答案
router.post('/', auth, create)
// 根据答案id来获取答案的具体信息
router.get('/:id', checkAnswerExist, findById)
// 更新一条答案
router.patch('/:id', auth, checkAnswerExist, update)
// 删除一条答案
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router
