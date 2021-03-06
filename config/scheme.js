var validator = require('validator');
var crypto = require('crypto');

module.exports = {
    "(GET|POST) /signup" : {
        "request": {
            "session": checkNotLogin
        }
    },

    "POST /signup": {
        "request": {
            "body": checkSignupBody
        }
    },

    "(GET|POST) /signin": {
        "request": {
            "session": checkNotLogin
        }
    },
    "POST /signin": {
        "request": {
            "body": checkSigninBody
        }
    },
    "POST /join":{
        "request": {
            "session": checkLogin
        }
    },
    "GET /admin":{
        "request":{
            "session": checkIsAdmin
        }
    },
    "GET /activity_create":{
         "request":{
            "session": checkLogin
        }
    },
    "GET /good_create":{
         "request":{
            "session": checkLogin
        }
    },
    "(GET | POST) /question_create":{
         "request":{
            "session": checkLogin
        }
    },
    "(GET | POST) /job_create": {
        "request": {
            "session": checkLogin
        }
    },
    "GET /admin_u": {
        "request": {
            "session": checkIsAdmin
        }
    }
};

function md5 (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function checkNotLogin() {
    if (this.session && this.session.user) {
        this.flash = {error: '已经登陆'};
        this.redirect('/');
        return false;
    }
    return true;
}

function checkLogin() {
    if (!this.session || !this.session.user) {
        this.flash = {error: "未登录"};
        this.redirect('/signin');
        return false;
    }
    return true;
}

function checkSignupBody() {
    var body = this.request.body;
    var flash;
    if (!body || !body.name) {
        flash = {error: "请填写用户名"　};
    }
    else if (!body.email || !validator.isEmail(body.email)) {
        flash = {error: "请填写正确的邮箱地址"};
    }
    else if (!body.password) {
        flash = {error: "请填写密码"};
    }
    else if (body.password !== body.re_password) {
        flash = {error: "两次密码不匹配"};
    }
    if (flash) {
        this.flash = flash;
        this.redirect('back');
        return false;
    }
    body.name = validator.trim(body.name);
    body.email = validator.trim(body.email);
    body.password = md5(validator.trim(body.password));
    body.tx_url = md5(validator.trim(body.email));
    return true;
}

function checkSigninBody() {
    var body = this.request.body;
    var flash;
    if (!body || !body.name) {
        flash = {error: '请填写用户名'};
    } else if (!body.password) {
        flash = {error: '请填写密码'};
    }

    if (flash) {
        this.flash = flash;
        this.redirect('back');
        return false;
    }

    body.name = validator.trim(body.name);
    body.password = md5(validator.trim(body.password));
    return true;
}

function checkIsAdmin() {
    var user = this.session.user.name;
    console.log(user);
    var flash;
    if(user !== '123') {
        flash = {error: '你当前没有权限'};
    } 
    if(flash){
        this.flash = flash;
        this.redirect('back');
        return false;
    }
    return true;
}


