module.exports = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        database:'test', // 前面建的user表位于些数据库中
        port: 3306,
        dateStrings: true,   // 时间以字符串形式显示，否则会有类似这样的显示：Thu Apr 14 2016 00:00:00 GMT+0800 (中国标准时间) 17:20:12
    }
};
