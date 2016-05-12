/**
 * Created by m on 16-3-5.
 */


var tmp = "hjyqeimpjeizbcbj";

var nodemailer = require('nodemailer');
var config = require('./config').default;

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: config.mail.host,
    port: config.mail.port,    // SMTP 端口
    auth: config.mail.auth
    
});


exports.send = function (name, receiver, url) {
    var html = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        + ' 亲爱的 ' + name + ' 您好:</br>'+
        '&nbsp;&nbsp; 欢迎您使用nbut.club,以下是激活链接</br>' +
        '&nbsp;&nbsp;<a href="localhost:3000/a/'+name +'/'+ url +'" target="_blank">此处登陆</a>'+
        '</br>' + '【此邮件请勿回复】';

    var mailOptions = config.mail.mailOptions;
    
     var mailOptions = {
            from: "869595931@qq.com",
            to: receiver,
            subject: "nbut.club 邮箱激活",
            html: html
        }

    smtpTransport.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("sent success!");
        }
    });
};
