/**
 * Created by m on 16-2-16.
 */
var nodemailer = require('nodemailer');
var Models = require('../lib/core');
var $User = Models.$User;
var $Good = Models.$Good;

var transporter = nodemailer.createTransport({
    server: "smtp.qq.com",
    secure: true,
    port: 465, // port
    auth: {
        user: '869595931@qq.com',
        pass: 'mnzlnsuhwpxnbfad'
    }

});
var mailOptions = {
    from: '<869595931@qq.com>', // sender address
    to: 'jooursion@126.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world </b>' // html body
};

exports.get = function *() {
    yield this.render('signup');
};

exports.post = function *() {

    var data = this.request.body;
    data.reg_date = Date.now();
    data.last_login = Date.now();
    data.state = 0;
    // 未实现。。。
/*
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        transporter.close();
    });
*/

    var UserExit = yield $User.getUserByName(data.name);
   // console.log(UserExit);
    if　(UserExit) {
        this.flash = {error: '用户名已经存在'};
        return this.redirect('/');
    } else {
        yield $User.addUser(data);
        console.log(data);
        this.session.user = {
           name: user.name,
           email: data.email
        };

        this.flash = {success: '注册成功'};
        this.redirect('index');
    }
};