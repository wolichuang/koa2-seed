const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
// const koaBody = require('koa-body');
const koaNunjucks = require('koa-nunjucks-2') // 模板
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session') // session
const logUtils = require('./utils/logUtils') // 日志

const index = require('./routes/index')
const users = require('./routes/users')
const posts = require('./routes/posts')

const api = require('./server/api')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form']
}))
app.use(json())
app.use(logger())
// app.use(koaBody({ multipart: true }))
app.use(require('koa-static')(__dirname + '/public'))
// static 静态文件目录
app.use(require('koa-static')(__dirname + '/static'))

// views 模板
// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))
app.use(koaNunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    trimBlocks: true,
    noCache: true // 开发环境下
  }
}));

// 配置存储session
let store = new MysqlSession({
  user: 'root',
  password: '',
  database: 'test',
  host: '127.0.0.1',
})
let cookie = {
  maxAge: '', // cookie有效时长
  expires: '',  // cookie失效时间
  path: '', // 写cookie所在的路径
  domain: '', // 写cookie所在的域名
  httpOnly: '', // 是否只用于http请求中获取
  overwrite: '',  // 是否允许重写
  secure: '',
  sameSite: '',
  signed: '',
  
}
app.use(session({
  key: 'SESSION_ID',
  store: store,
  cookie: cookie
}))

// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    //记录响应日志
    logUtils.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtils.logError(ctx, error, ms);
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(posts.routes(), posts.allowedMethods())
app.use(api.routes(), api.allowedMethods())


// 错误页面
app.use(async (ctx, next) => {
    await next();
    if (ctx.body || !ctx.idempotent) return;
    ctx.render('error',{title:"404页面"});
});


module.exports = app
