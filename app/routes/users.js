const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/users' })
const {
  getAll, getById, create, update,
  del, login, checkOwner, listFollowing,
  follow, unfollow, listFollowers, checkUserExist
} = require('../controllers/users')

const auth = jwt({
  secret: process.env.JWt_SECRET
})
router.get('/', getAll)
router.post('/', create)
router.get('/:id', getById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.put('/follow/:id', auth, checkUserExist, follow)
router.delete('/unfollow/:id', auth, checkUserExist, unfollow)
router.get('/:id/followers', listFollowers)

module.exports = router
