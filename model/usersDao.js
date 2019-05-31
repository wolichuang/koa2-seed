const { dbUtils } = require('../utils/dbUtils')
const usersMapping = require('./usersMapping.js');
const usersDao = {};

// 全部用户
async function queryAll(){
    let sql = usersMapping.queryAll;
    let UsersList = await dbUtils(sql);
    return UsersList;
}

// 删除用户
async function deleteById(id){
    let sql = usersMapping.deleteById;
    let flag = await dbUtils(sql,id);
    return flag;
}

// 查询id
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

// 修改用户
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

// 新增用户
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

usersDao.queryAll = queryAll // 查询全部
usersDao.deleteById = deleteById // 删除
usersDao.queryById = queryById // 查询
usersDao.updateUser = updateUser // 修改
usersDao.insertUser = insertUser // 新增

module.exports = usersDao