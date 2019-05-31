var mysql = require('mysql');
var log4js = require('log4js'); // 日志
var crypto = require('crypto'); // 加密

var $conf = require('../config/db'); // 数据库
var utils = {
    /*
    // 数据库链接
    pool: function () {
        function extend(target, source, flag) {
            for (var key in source) {
                if (source.hasOwnProperty(key))
                    flag ?
                        (target[key] = source[key]) :
                        (target[key] === void 0 && (target[key] = source[key]));
            }
            return target;
        }

        // 使用连接池，提升性能
        return mysql.createPool(extend({}, $conf.mysql));
    },
    // 日志输出
    log: function () {
        log4js.configure({
            appenders: [
                { type: 'console' },
                {
                    type: 'dateFile',
                    filename: 'logs/error.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024,
                    alwaysIncludePattern: false,
                    backups: 4,
                    category: 'logger'
                }
            ],
            replaceConsole: true
        });
        return log4js.getLogger('logger');
    },
    */
    // 数据格式化
    jsonWrite: function (res, ret) {
        if (typeof ret === 'undefined') {
            res.json({
                code: '1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    },
    // 加密
    hexPwd: function (password) {
        var md5 = crypto.createHash('md5');
        return md5.update(password).digest('hex');
    },
    // session
    authorize :function(req, res, next) {
        if(!req.session.user_id) {
            res.redirect('/login');
        }else{
            next();
        }
    },
    // uuid
    uuid : function(){
        var S4 = function(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4() + S4());
    }
};
module.exports = utils;