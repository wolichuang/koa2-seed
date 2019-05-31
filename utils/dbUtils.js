const mysql = require('mysql')
const log4js = require('log4js')

const dbConfig = require('../config/dbConfig') // 数据库配置

const pool = mysql.createPool(dbConfig.mysqls) // 数据库链

let dbUtils = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

let jsonsUtils = function(status,msg,data){
   let jsons={};
   jsons.status = status || 400;  
   jsons.msg = msg || '';  
   jsons.data = data || null;  
   return jsons;
}

let logUtils = function () {
    log4js.configure({
        appenders: [
            { type: 'console' },
            {
                type: 'dateFile',
                filename: 'logs/excels.log',
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
}

module.exports = { dbUtils , jsonsUtils, logUtils}