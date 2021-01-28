const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const {
  getAllUser,
  getUserById,
  register,
  updateUser,
  delUser,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist,
  followTopic,
  unfollowTopic,
  checkTopicExist,
  listFollowingTopics,
  listQuestions,
  likeAnswer,
  unlikeAnswer,
  listLikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
  listDislikingAnswers,
  listCollectingAnswers,
  collectAnswer,
  uncollectAnswer
} = require('../controllers/users')
const { checkAnswerExist } = require('../controllers/answers')
const auth = require('../middlewares/jwt-auth')

// 注册
router.post('/', register)

// 登录
router.post('/login', login)

// 获取所有用户-支持分页
router.get('/', auth, getAllUser)

// 通过用户id来获取用户信息，支持通过字段查询
router.get('/:id', auth, getUserById)

// 更新用户信息
router.patch('/:id', auth, checkOwner, updateUser)

// 删除用户信息
router.delete('/:id', auth, checkOwner, delUser)

// 列出某个用户的粉丝
router.get('/:id/following', listFollowing)

// 关注某人
router.put('/follow/:id', auth, checkUserExist, follow)

// 取消关注某人
router.delete('/unfollow/:id', auth, checkUserExist, unfollow)
router.get('/:id/followers', listFollowers)
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)
router.get('/:id/followingTopics', listFollowingTopics)
router.get('/:id/questions', listQuestions)

router.put('/likingAnswer/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)
router.delete('/likingAnswer/:id', auth, checkAnswerExist, unlikeAnswer)
router.get('/:id/likingAnswer', listLikingAnswers)

router.put('/dislikingAnswer/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)
router.delete('/dislikingAnswer/:id', auth, checkAnswerExist, undislikeAnswer)
router.get('/:id/dislikingAnswer', listDislikingAnswers)

router.put('/collectingAnswer/:id', auth, checkAnswerExist, collectAnswer)
router.delete('/collectingAnswer/:id', auth, checkAnswerExist, uncollectAnswer)
router.get('/:id/collectingAnswer', listCollectingAnswers)

module.exports = router
