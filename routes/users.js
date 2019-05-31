const router = require('koa-router')()
const koaBody = require('koa-body'); // 上传图片
const fs = require("fs")
const path = require("path")
const os = require('os')
const xlsx = require('node-xlsx')

const { dbUtils,jsonsUtils,logUtils } = require('../utils/dbUtils')
const logger = logUtils()
const usersDao = require('../model/usersDao')

router.prefix('/users')

// 查
router.get('/', async (ctx, next) => {
  var UsersList = await usersDao.queryAll(); // 返回数据
  await ctx.render('users/list',{
    title: '用户列表',
    data: UsersList
  });
})

// 增
router.get('/add', async (ctx, next) => {
  await ctx.render('users/one',{
    title: '新增用户'
  });
})
router.post('/insertUser', async (ctx, next) => {
  var username = ctx.request.body.username;
  var password = ctx.request.body.password;
  var realname = ctx.request.body.realname;
  var flag = await usersDao.insertUser(username,password,realname); // 返回标识
  if(flag!==undefined){
    await ctx.redirect('/users');
  }else{
    await next();
  }
})

// 删
router.get('/deleteById/:id', async (ctx, next) => {
  var id = ctx.params.id;
  var flag = await usersDao.deleteById(id); // 返回标识
  if(flag!==undefined){
    await ctx.redirect('/users');
  }else{
    await next();
  }
})

// 改
router.get('/queryById/:id', async (ctx, next) => {
  var id = ctx.params.id;
  ctx.session = {userid: id,count: 0}; // 存入session
  var user = await usersDao.queryById(id); // 返回标识
  if(user!==undefined){
    await ctx.render('users/one',{
      title: '修改用户',
      user: user
    });
  }else{
    await next();
  }
})

router.post('/updateUser', async (ctx, next) => {
  var username = ctx.request.body.username;
  var password = ctx.request.body.password;
  var realname = ctx.request.body.realname;
  var id = ctx.session.userid || "1"; // 取 userid
  var flag = await usersDao.updateUser(id,username,password,realname); // 返回标识
  if(flag!==undefined){
    await ctx.redirect('/users');
  }else{
    await next();
  }
})


// 分页
router.get('/page', async(ctx, next) => {
    const p = ctx.query.p || 1;  
    const limit = 5;  
    const allData = {currentPage:p,totalPages:0};  
    const counts = await dbUtils("select count(1) count from tab_users");
    if(counts){  
        allData.totalPages = Math.ceil(counts[0].count/limit); //总的页数
    }
    const sqls = "SELECT * FROM tab_users LIMIT "+(p-1)*limit+","+limit;
    const usersData = await dbUtils(sqls);
    if(usersData){
      allData.usersData = usersData;
    }
    await ctx.render('users/page', {
        title: '用户数据信息',
        allData: allData
    })
});

// 导入 excel
router.get('/importExcel', async (ctx,next) => {
  await ctx.render('users/excel', {
      title: '导入'
  })
});
router.post('/importExcel', koaBody({ multipart: true }) ,async (ctx,next) => {
  const file = ctx.request.body.files.file;
  const filename = file.name;
  const reader = fs.createReadStream(file.path);
  const homeDir = path.resolve(__dirname,'..');
  const newpath = homeDir + '/static/' + filename;
  const stream = fs.createWriteStream(newpath);
  reader.pipe(stream); // 写入文件流
  console.log('上传成功 %s -> %s', filename , stream.path);
  if(stream.path!=="") {
      // 读取excel
      const datas = xlsx.parse(stream.path);
      const values = datas[0].data;
      // 写入表
      const sqls = "INSERT INTO tab_users (username,password,email,age,realname,birthday,address) VALUES ?";
      await dbUtils(sqls,[values],function(error,results,fields){
        if(error) throw error;
        // 写入日志
        logger.info("上传文件excel" + stream.path + 'ok' );
      });
  }
  await ctx.redirect('/users/page');
});

// 导出 excel
router.get('/exportExcel',async (ctx,next) => {
    const sqls = 'SELECT username,password,email,age,realname,birthday,address FROM tab_users';
    const allUsers = await dbUtils(sqls);
    const datas = [];
    for (var i = 0; i < allUsers.length; i++) {
      const single = [];
      for(j in allUsers[i]){
        single.push(allUsers[i][j]);
      }
      datas.push(single);
    };
    const buffer = xlsx.build([{name: "tab_users", data: datas}]);
    const homeDir = path.resolve(__dirname,'..')
    const newpath = homeDir + '/static/tab_users.xlsx';

    fs.writeFileSync(newpath, buffer, 'binary');

    ctx.response.body = jsonsUtils(200,'ok',JSON.stringify(allUsers));
});


module.exports = router
