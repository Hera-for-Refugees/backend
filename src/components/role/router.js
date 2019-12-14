const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('boom')

module.exports = router.getOriginal()
