/**
 * Created by m on 16-3-5.
 */


var tmp = "hjyqeimpjeizbcbj";

var nodemailer = require('nodemailer');

var stmpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.qq.com",
    port: 587,                                      // SMTP 端口
    auth: {
        user: "869595931.com",            //用户名
        pass: "xxxxxx"                          //密码
    }




})