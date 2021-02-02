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

// 获取用户的粉丝列表
router.get('/:id/followers', listFollowers)

// 用户关注其他用户
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)

// 用户取关其他用户
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)

// 获取用户的话题关注列表
router.get('/:id/followingTopics', listFollowingTopics)

// 获取用户关注的问题列表
router.get('/:id/questions', listQuestions)

// 点赞
router.put('/likingAnswer/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)

// 取消点赞
router.delete('/likingAnswer/:id', auth, checkAnswerExist, unlikeAnswer)

// 列出用户点赞列表
router.get('/:id/likingAnswer', listLikingAnswers)

// 踩
router.put('/dislikingAnswer/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)

// 取消踩
router.delete('/dislikingAnswer/:id', auth, checkAnswerExist, undislikeAnswer)

// 列出用户所有踩的列表
router.get('/:id/dislikingAnswer', listDislikingAnswers)

// 收藏答案
router.put('/collectingAnswer/:id', auth, checkAnswerExist, collectAnswer)

// 取消收藏答案
router.delete('/collectingAnswer/:id', auth, checkAnswerExist, uncollectAnswer)

// 获取用户所有收藏答案列表
router.get('/:id/collectingAnswer', listCollectingAnswers)

module.exports = router
