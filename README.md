# koa2.x learning


## 安装

```
npm install -g koa2
npm install -g koa2-generator
```

## 路由 koa-router

const router = require('koa-router')()

ctx：封装了request 和 response变量

next: 传入将要处理的下一个异步函数

由async标记的函数称为异步函数，在异步函数中，可以用await调用另一个异步函数，这两个关键字将在ES7中引入。

`${ctx.request.url}` 输出 请求的url 地址 ctx.url相当于ctx.request.url，ctx.type相当于ctx.response.type

处理路由器的操作分为：views、 string、 json、 处理get请求、 处理post请求

### views

```
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
```

### string

```
router.get('/string',async (ctx, next) =>{ 
    ctx.response.body = `<h1>welcome, hello</h1>`;
})
```

### json

```
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

```
### 处理get请求

var name = ctx.params.name;

```
router.get('/info/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})
```
### 处理post请求

var name = ctx.request.body.name || '';

需要引入 koa-bodyparser 中间件, 创建 info.pug 用于处理表单

```
extends layout

block content
  h1= title
  form(action="/signin" method="post")
    p= '用户名：'
    input(type="text" name="name" value="koa")
    p= '密码：'
    input(type="password" name="password" value="koa")
    p
    input(type="submit" value="提交")
```

```
router.get('/info', async (ctx, next) => {
  await ctx.render('info',{
    title: '用户信息'
  });
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
```

## 视图 - views层

适用于 koa 的模板引擎选择非常多，比如 jade、ejs、nunjucks、handlebars 、xtemplate 等。

Nunjucks是Mozilla开发的一个纯JavaScript编写的模板引擎 koa-nunjucks-2^3.0.2

https://mozilla.github.io/nunjucks/cn/templating.html

```
const koaNunjucks = require('koa-nunjucks-2')
app.use(koaNunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    trimBlocks: true,
    noCache: false // 开发环境下
  }
}));
```

```
// 模块
{% extends 'base.html' %}
{% block body %} <div>No body</div> {% endblock %}

// 循环
{% for msg in data %}
  <p>{{ msg }}</p>
{% endfor %}

{{loop.index}}

{% for i in range(1, jsonHearts.days + 1) -%}
   <a href="/{{i}}">{{i}}</a>
{%- endfor %}

{% for user in allData.usersData %}
  <tr>
      <td>{{ user["username"] }}</td>
      <td>{{ user["email"] }}</td>
      <td>{{ user["age"] }}</td>
      <td>{{ user["realname"] }}</td>
  </tr>
{% endfor %}

{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}

{% include './header.html' %}
```

## 操作cookie

koa提供了从上下文直接读取、写入cookie的方法:

- ctx.cookies.get(name, [options]) 读取上下文请求中的cookie
- ctx.cookies.set(name, value, [options]) 在上下文中写入cookie

```
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
```

## 操作session

将session存放在MySQL数据库中 koa-session-minimal、koa-mysql-session "koa-session-minimal":"^3.0.4","koa-mysql-session":"^0.0.2"

```
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')

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
```

```
// 处理session
router.get('/session', async (ctx,next) => {
  ctx.session = {
    user_id: Math.random().toString(36).substr(2),
    count: 0
  }
  ctx.response.body = `<h1>session, ${ctx.session.user_id}, ${ctx.session.count}</h1>`; // 输出cookie值
})
```

## 操作mysql

安装 mysql "mysql":"^2.15.0"

用户增、删、改、查

```
// 查询
async function queryAll(){
    let sql = usersMapping.queryAll;
    let UsersList = await dbUtils(sql);
    return UsersList;
}
// 新增
async function insertUser(username,password,realname){
    let sql = usersMapping.insertUser;
    var values = [username,password,realname]; // 数组
    let result = await dbUtils(sql,values);
    if ( Array.isArray(result) && result.length > 0 ) {
        result = result[0]
    } else {
        result = null
    }
    return result
}
// 修改
async function queryById(id){
    let sql = usersMapping.queryById;
    let result = await dbUtils(sql,id);
    if ( Array.isArray(result) && result.length > 0 ) {
        result = result[0]
    } else {
        result = null
    }
    return result
}
async function updateUser(id,username,password,realname){
    // 从session中取 id
    let sql = usersMapping.updateUser;
    var values = [username,password,realname,id]; // 数组
    let result = await dbUtils(sql,values);
    if ( Array.isArray(result) && result.length > 0 ) {
        result = result[0]
    } else {
        result = null
    }
    return result
}
// 删除
async function deleteById(id){
    let sql = usersMapping.deleteById;
    let flag = await dbUtils(sql,id);
    return flag;
}
```

## 日志

npm install log4js@1.x --save

添加 config/logConfig.js

添加 utils/logUtils

添加 logs/access 、logs/error

修改 app.js 添加 log4js 插件

fixed log4js 2.x 会报错

使用 config/log2.x.js 配置文件

## 分页

issue koa2 分页

## 上传下载Excel

issue koa2 上传下载

## ajax 读取数据

读取 usersApi 里的数据 输出到页面

### 准备 ajax
```
$.ajax({
  url:'http://127.0.0.1:3000/api/user/all',
  type:'GET',
  dataType:'json',
  async:true,
  success:function(res){
      
  },
  error:function(err){

  }
```
### 准备 juicer 轻量级模板引擎

```
var tpl = '{@each result as user,index}<li>${user.username} ${user.password} ${user.realname}'
                    +'<a href="/users/queryById/{{ user.id}}">修改</a><a href="/users/deleteById/{{user.id}}">删除</a></li>{@/each}';
var html = juicer(tpl, res); // 模板 + 数据层
```

## 博客

posts 创建 routes/post.js

## restful get put delete 

添加 server/api.js 路由

添加 model/usersApi.js 数据模型




## github:

https://github.com/lichuang4419/koa-learn
