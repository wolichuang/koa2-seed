const router = require('koa-router')();
const usersApi = require('../model/usersApi');


router.get('/api/user/all',usersApi.queryAll)
.get('/api/user/up',usersApi.queryByUp)
.get('/api/user/down',usersApi.queryByDown)

module.exports = router