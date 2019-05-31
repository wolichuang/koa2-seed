const { dbUtils } = require('../utils/dbUtils')
const usersDao = require('./usersDao');   // 引入用户模块逻辑层
class usersApi {

    // 用户查询
    static async queryAll(ctx) {
        const sql = 'select * from tab_users';
        const values = [];
        const userList = await dbUtils(sql,values);
        ctx.response.body = {
            code:0,
            message:"用户数据",
            result: userList
        }
    }

    // 排序 up
    static async queryByUp(ctx) {
        const sql = 'select * from tab_users order by id desc';
        const values = [];
        const userList = await dbUtils(sql,values);
        ctx.response.body = {
            code:0,
            message:"用户数据",
            result: userList
        }
    }

    // 排序 down
    static async queryByDown(ctx) {
        const sql = 'select * from tab_users order by id asc';
        const values = [];
        const userList = await dbUtils(sql,values);
        ctx.response.body = {
            code:0,
            message:"用户数据",
            result: userList
        }
    }
}
module.exports = usersApi;
  