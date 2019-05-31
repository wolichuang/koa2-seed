const router = require('koa-router')()

const koaBody = require('koa-body'); // 上传图片
const fs = require("fs")
const path = require("path")
const os = require('os')

// views
router.get('/', async (ctx, next) => {
  // 读取session信息
  ctx.session.count = ctx.session.count + 1

  await ctx.render('index', {
    title: 'Hello Koa 2!',
    session: ctx.session
  })
})

router.get('/hello', async (ctx, next) => {
  await ctx.render('hello', {
    name: 'Hello Koa 2!'
  })
})

// json
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// 字符串
router.get('/string',async (ctx, next) =>{
  const start = new Date().getTime(); // 当前时间
  ctx.body = {
    stime: start
  }
  await next(); //调用下一个middleware 
  console.log('===================>',`${ctx.request.method} ${ctx.request.url}`); // 打印URL
  const end = new Date().getTime() - start;
  console.log('===================>',`${end}ms`); // 时间
})

// 处理get请求
router.get('/info', async (ctx, next) => {
  await ctx.render('info',{
    title: '用户信息'
  });
})
router.get('/info/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})

// 处理post请求
router.post('/signin', async (ctx,next) => {
  var name = ctx.request.body.name || '';
  var password = ctx.request.body.password || '';
  if(name === 'koa' && password === 'koa') {
    ctx.response.body = `<h1>welcome, ${name}</h1>`;
  }else{
    ctx.response.body = `<h1>Login faild!</h1>
    <p><a href="/">Login</a></p>
    `
  }
})

// 处理cookie
router.get('/cookie', async (ctx,next) => {
  const options = {
    domain:'127.0.0.1',
    path:'/',
    maxAge: 10 * 60 * 1000, // cookie有效时长
    expires: new Date('2019-02-02'),  // cookie失效时间
    httpOnly: false,  // 是否只用于http请求中获取
    overwrite: false  // 是否允许重写
  }
  ctx.cookies.set('id','test cookie',options)

  ctx.response.body = `<h1>cookies, ${ctx.cookies.get('id')}</h1>`; // 输出cookie值
})

// 处理session
router.get('/session', async (ctx,next) => {
  ctx.session = {
    user_id: Math.random().toString(36).substr(2),
    count: 0
  }
  ctx.response.body = `<h1>session, ${ctx.session.user_id}, ${ctx.session.count}</h1>`; // 输出cookie值
})

// 上传
router.get('/upload',async (ctx,next) => {
  await ctx.render('upload',{
    title: '上传'
  });
})
router.post('/upload', koaBody({ multipart: true }) ,async (ctx,next) => {
  const file = ctx.request.body.files.file;
  const filename = file.name; // 文件名
  const reader = fs.createReadStream(file.path);
  const homeDir = path.resolve(__dirname,'..')
  const newpath = homeDir + '/static/' + filename;
  const stream = fs.createWriteStream(newpath);
  // const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
  reader.pipe(stream); // 写入文件流
  console.log('uploading %s -> %s', filename , stream.path);
  // ctx.response.body = `<h1>上传成功！！！</h1>`;
  ctx.response.body = {
    code:0,
    message:"上传成功",
    result: {
      urls:stream.path
    }
  }
})


module.exports = router
