const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/users' })
const {
  getAll, getById, create, update,
  del, login, checkOwner, listFollowing,
  follow, unfollow, listFollowers, checkUserExist,
  followTopic, unfollowTopic, checkTopicExist,
  listFollowingTopics,
  listQuestions
} = require('../controllers/users')

const auth = jwt({
  secret: process.env.JWt_SECRET
})

// 注册
router.post('/', create)

// 登录
router.post('/login', login)

// 获取所有用户-支持分页
router.get('/', auth, getAll)

// 通过用户id来获取用户信息，支持通过字段查询
router.get('/:id', auth, getById)

// 更新用户信息
router.patch('/:id', auth, checkOwner, update)

// 删除用户信息
router.delete('/:id', auth, checkOwner, del)
router.get('/:id/following', listFollowing)
router.put('/follow/:id', auth, checkUserExist, follow)
router.delete('/unfollow/:id', auth, checkUserExist, unfollow)
router.get('/:id/followers', listFollowers)
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)
router.get('/:id/followingTopics', listFollowingTopics)
router.get('/:id/questions', listQuestions)

module.exports = router
