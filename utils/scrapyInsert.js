/**
 * name 自动抓取藏书网书籍
 * des 工具方法
 * time 2017-10-11
 */
var http = require("http");
var cheerio = require("cheerio");
var mysql = require("mysql");
var util = require("../utils/util");
var colors = require('colors'); // 颜色控制
colors.setTheme({  
  silly: 'rainbow',  
  input: 'grey',  
  verbose: 'cyan',  
  prompt: 'red',  
  info: 'green',  
  data: 'blue',  
  help: 'cyan',  
  warn: 'yellow',  
  debug: 'magenta',  
  error: 'red'  
});
var config = {
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "",
  database: "db_vo"
};

var pageUrl = "http://www.99lib.net/popular/index.php";
var client = mysql.createConnection(config);

// 解析数据
http.get(pageUrl, function(res) {
  var html = "";
  res.on("data", function(data) {
    html += data;
  });
  res.on("end", function() {
    callback(html); // 数据回调
  });
});

// 数据筛选
function callback(html) {
  // 使用load方法
  var $ = cheerio.load(html,{decodeEntities: false});
  var arrUrl = [];
  var objUrl = {};
  client.connect();
  // 处理数据
  var $list = $("#list_new").find("li");
  $list.each(function(index, ele) {
    objUrl["name"] = $(ele)
      .find("h2")
      .text();
    objUrl["image"] = $(ele)
      .find("img")
      .attr("src");
    objUrl["brief"] = $(ele)
      .find(".intro")
      .html();
    objUrl["price"] = 10;
    objUrl["count"] = 50;
    objUrl["uuid"] = util.uuid(); // 唯一标识
    //console.log(objUrl);
    // 数据入库
    var query = client.query("INSERT INTO tab_book SET ?", objUrl, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      // Neat!
      console.log("数据入库成功".green);
    });
  });
  client.end();
}
