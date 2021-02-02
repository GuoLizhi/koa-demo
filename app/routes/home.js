const Router = require('koa-router')
const router = new Router()
const { index, upload } = require('../controllers/home')

router.get('/', index)
// 上传文件
router.post('/upload', upload)

module.exports = router
