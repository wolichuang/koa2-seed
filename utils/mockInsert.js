var $conf = require("../conf/db.js");
var $util = require('../util/util');
var mysql = require("mysql");
var Mock = require("mockjs");

var $sql = {
    insert:'INSERT INTO tab_users(id, username, password,email,age,realname,birthday,address) VALUES(0,?,?,?,?,?,?,?)',
};
var pool = mysql.createPool($util.extend({}, $conf.mysql));
var data = Mock.mock({
    "tab_users|1-10": [{
        'id|+1': 1, // uuid
        'realname':'@cname', //真实姓名
        'username': '@word',   //中文名称
        'password': '@word',
        'email': '@email',
        'age|1-100': 100,   //100以内随机整数
        'birthday': '@date("yyyy-MM-dd")',  //日期
        'address': '@city(true)'   //中国城市
    }]
});

var insert = function(){
    pool.getConnection(function(err, connection) {
        var tab_users = data.tab_users;
        var i=0;
        while(i < tab_users.length) {
        //for(var i = 0;i < tab_users.length; i++){
            var param = tab_users[i];
            connection.query($sql.insert,[param.username,param.password,param.email,param.age,param.realname,param.birthday,param.address], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'增加成功'
                    };    
                }
                // 以json形式，把操作结果返回给前台页面
                console.log("插入成功");
            });
            i++;
            // 释放连接   
        //}
        }
        
    });
}

// 插入数据
insert();