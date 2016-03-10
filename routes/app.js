/**
 * Created by m on 16-2-22.
 */

var Models = require('../lib/core');
var $Activity = Models.$Activity;
var $ActivityComment = Models.$ActivityComment;
var $User = Models.$User;
var $Good = Models.$Good;
var $GoodComment = Models.$GoodComment;
var $Join = Models.$Join;
var $Star = Models.$Star;
var $Message = Models.$Message;



/*测试代码片段*/
var uuid = require('node-uuid');
var formidable = require('formidable');
var qn = require('qn');
var koaBody = require('koa-body')();
var parse = require('co-busboy');
var fs = require('fs');
var path = require('path');
var gravatar = require('gravatar');

module.exports = function (app, router) {

    // 登陆注册，登出
    router.get('/logout', function *() {
        this.session = null;
        this.redirect('/');
    });

    router.get('/signin', function *() {
        yield this.render('signin');
    });

    router.post('/signin', function *() {
        var data = this.request.body;
        console.log(data);
        var UserInfo = yield $User.getUserByName(data.name);
        if (!UserInfo || (UserInfo.password !== data.password)) {

            console.log(UserInfo.password);
            console.log(data.password);
            this.flash = {error: '用户名或者密码错误！'};
            return this.render('signin');
        }

        this.session.user = {
            name: UserInfo.name,
            email: UserInfo.email,
            tx_url: UserInfo.tx_url
        };

        this.flash = {success: '登陆成功'};
        this.redirect('/');
    });

    router.get('/signup', function *() {
        yield this.render('signup');
    });

    router.post('/signup', function *() {
        var data = this.request.body;
        data.reg_date = Date.now();
        data.last_login = Date.now();
        data.state = 0;

        var UserExit = yield $User.getUserByName(data.name);
        if　(UserExit) {
            this.flash = {error: '用户名已经存在'};
            return this.redirect('/');
        } else {
            yield $User.addUser(data);
            console.log(data);
            this.session.user = {
                name: data.name,
                email: data.email,
                tx_url: data.tx_url
            };

            this.flash = {success: '注册成功'};
            this.redirect('/');
        }
    });


    router.get('/', function *(){
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('index',{
            messageCount: MessageCount
        });
    });

    // activity 首页
    router.get('/activity/p/:p', function *() {
        var p = this.params.p;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('activity_index',{
            activitys : $Activity.GetActivityByTab(p),
            activitiesCount : $Activity.getActivityCount(),
            messageCount: MessageCount,
            HotActivity: $Activity.getHotActivity()
        });
    });

    //activity详细页面
    router.get('/activity/:id', function *() {
        var id = this.params.id;
        var user = "";
        var st = "";
        if (this.session.user) {
            user = this.session.user;
            st = yield $Join.IsJoin(user.name , id);
        }
        console.log(typeof(st));
        var join = 0;
        if (st.length == 0) {
            join = 0;
            console.log(st);
            console.log('join' + join);
        } else {
            console.log('join');
            join = 1;
        }

        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('activity',{
            activity: $Activity.getActivityById(id),
            activity_comments: $ActivityComment.getActivityComment(id),
            isJoin: join,
            joiners: $Join.getJoinById(id),
            messageCount: MessageCount,
            HotActivity: $Activity.getHotActivity()
        });
    });

    //activity 回复
    router.post('/activity_comment_submit', function *() {
        var data = this.request.body || {};
        data.user = this.session.user;
        data.user.tx_url = this.session.user.tx_url;
        data.create_at = Date.now();
        //生成Message
        /*var message = {};
        message.type = "回复了";
        message.sender = this.session.user.name;
        message.target =  "";
        message.url = "";
        message.create */
        var message = {
            type: "回复了你的活动",
            sender: this.session.user.name,
            target: "",
            url: "",
            create_at : Date.now()
        };

        console.log(data);
        yield [
            $ActivityComment.addActivityComment(data),
            $Activity.incCommentById(data.activity_id),
            $Message.addMessage(message)
        ];
        this.redirect('/activity');
    });

    //activity 参加
    router.post('/join', function *() {
        var data = this.request.body;
        data.user = this.session.user;
        data.tx_url = this.session.tx_url;
        console.log(data);
        yield [
            $Join.addJoin(data),
            $Activity.incJoinById(data.activity_id)
        ];
        var cbdata = yield $Activity.getActivityById(data.activity_id);
        var Data = {
            "join": cbdata.join,
            "status": "退出参加"
        };
        this.redirect('back');
        this.status = 200;
        this.body = Data;

    });

    //activity　取消参加
    router.post('/deljoin', function *() {
        var data = this.request.body;
        data.name =  this.session.user.name;
        console.log(data);
        yield [
            $Join.delJoin(data.name, data.activity_id),
            $Activity.subJoinById(data.activity_id)
        ];
        var cbdata = yield $Activity.getActivityById(data.activity_id);
        var Data = {
            "join": cbdata.join,
            "status": "参加"
        };
        this.redirect('back');
        this.status = 200;
        this.body = Data;
    });

    //activity 创建
    router.get('/activity_create', function *() {
        yield this.render('activity_create');
    });

    router.post('/activity_create', function *() {
        var data = this.request.body;
        //data.title = "dsds";
        data.create_date = Date.now();
        data.update_date = Date.now();
        data.founder = this.session.user;
        data.join = 1;
        data.pv = 0;
        data.comment = 0;
        console.log(data);

        yield $Activity.addActivity(data);
        this.flash = {success: '发布活动成功'};
        this.redirect('/activity/p/1');
    });

    //activity 修改
    router.get('/activity_edit/:id', function *() {
        var id = this.params.id;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('activity_edit', {
            activity: $Activity.getActivityById(id),
            messageCount : MessageCount
        });
    });

    router.post('/activity_edit/:id', function *() {
        var id = this.params.id;
        var data = this.request.body;
        data.update_date = Date.now();
        console.log(data);
        yield $Activity.editActivity(id, data);
        this.flash = {success: '修改活动成功'};
        this.redirect('/activity/'+ id);
    });

    //activity 删除
    router.post('/activity_del', function *() {
        var data = this.request.body;
        yield $Activity.deleteActivity(data.activity_id);
    });

    //good 首页
    router.get('/good', function *() {
        var tab = this.query.tab;
        var p = this.query.p;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('good_index', {
            goods: $Good.GetGoodByTab(tab, p),
            messageCount: MessageCount,
            Goodcounts: $Good.getGoodsCount(tab)
        });
    });

    /*测试good的restful*/
    router.get('/good/:tab/:p',function *(){
        var tab = this.params.tab;
        var p = this.params.p;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('good_index',{
            goods: $Good.GetGoodByTab(tab, p),
            messageCount: MessageCount,
            Goodcounts: $Good.getGoodsCount(tab),
            HotGoods: $Good.getHotGoods()
        });
        console.log(tab + "," + p);

    });

    //good　创建
    router.get('/good_create', function *() {
        yield this.render('good_create');
    });

    router.post('/good_create', function *() {
        var data = this.request.body;
        console.log(data.tab);
        data.seller = this.session.user;
        data.pv = 0;
        data.star = 0;
        data.comment = 0;
        data.create_at = Date.now();
        data.update_at = Date.now();
        yield $Good.addGood(data);
        this.flash = {success: '发布闲置成功成功'};
        this.redirect('/good');

    });

    router.get('/good/:id', function *() {
        var id = this.params.id;
        var user = "";
        var st = "";
        if (this.session.user) {
            user = this.session.user;
            st = yield $Star.IsStar(user.name , id);
        }
        var star = 0;
        if (st.length == 0) {
            star = 0;
            console.log(st);
            console.log('star' + star);
        } else {
            console.log('star');
            star = 1;
        }

        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('good',{
            good: $Good.getGoodById(id),
            good_comments: $GoodComment.getGoodComment(id),
            HotGoods: $Good.getHotGoods(),
            isStar: star,
            starers: $Star.getStarById(id),
            messageCount: MessageCount

        });
    });

    router.get('/good_edit/:id', function *() {
        var id = this.params.id;
        yield this.render('good_edit',{
            good: $Good.getGoodById(id)

        });
    });

    router.post('/good_edit/:id', function *() {
        var id = this.params.id;
        var data = this.request.body;
        data.update_at = Date.now();
        console.log(data);
        yield $Good.editGood(id, data);
        this.flash = {success: '修改商品成功'};
        this.redirect('/good/' + id);
    });

    router.post('/good_comment_submit', function *() {
        var all = this.request.body || {};
        var turl = this.request.url;
        console.log(all);
        var data = {};
        data.content = all.content;
        data.good_id = all.good_id;
        var seller = all.seller;
        data.user = this.session.user;
        data.create_at = Date.now();
        //data.remove(seller);
        console.log(data);
        //   console.log('---' + data);
        yield [
            $GoodComment.addGoodComment(data),
            $Good.incCommentById(data._id)
        ];
        //如果操作的不是自己的，创建新的消息，插入数据。
        if (seller.name != this.session.user.name) {
            var message = {};
            message.sender = this.session.user.name;
            message.target = seller;
            message.type = "回复了你的闲置";
            message.content = all.good_name;
            message.url = "/good/" + all.good_id;
            message.create_at = Date.now();
            message.has_read = false;
            console.log(message);
            yield $Message.addMessage(message);
        }
        // this.redirect('activity/'+ data.activity_id);
        //this.redirect('/good/' + all.good_id);
        this.redirect('back');
    });

    router.get('/u/:id', function *() {
        var user_id = this.params.id;
        var userInfo = yield $User.getUserByName(user_id);
        console.log(userInfo);
        if(userInfo == null || userInfo.length == 0) {
            return this.redirect('/404');
        } else {
            yield this.render('user',{
                user: userInfo,
                user_joins: $Join.getJoinByName(userInfo.name),
                user_goods: $Good.getGoodsByName(userInfo.name),
                user_stars: $Star.getStarByName(userInfo.name),
                user_activities: $Activity.getActivityByName(userInfo.name),
                messageCount: $Message.CountMyMessage(userInfo.name)
            });
        }
    });

    router.get('/message', function *() {
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('message', {
            messages: $Message.getMessageByName(this.session.user.name),
            messageCount: MessageCount
        });
    });



    /*
    * 测试formidable
    *
    * */

    router.get('/img', function *() {
        var uid = uuid.v4();
        console.log(uid);
        yield this.render('testimg');
    });

    /*router.post('/img', function *() {
        console.log(this.request.files);
        var files = this.request.body.upfile;
        console.log(files);
        //var qn = require('qn');
      /!*  var client = qn.create({
            accessKey: 'qgEdPE_-N9w0Ln_ckceM6B1PoJhl0-BCkTnuQKre',
            secretKey: 'QXemEA4LSNpywF3BiUNYkID5L0ur3-dfKYeVrr8N',
            bucket: 'nbut-club',
            origin:'7xrkb1.com1.z0.glb.clouddn.com'

        });

        client.uploadFile(img,{key:'www.jpg'},function(err, result){
            console.log(result);
        });*!/

       /!* form.parse(img, function (err) {
            if(err) {
                console.log(err);
            }
        })*!/

        /!*test for formidable*!/

    /!*    var form = new formidable.IncomingForm();
        form.uploadDir = './temp';
        form.encoding = 'utf-8';
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.parse(img, function(err, fields, files){
            this.status = 200;
            this.body = util.inspect({fields: fields, files: files});
        })*!/

       // if(files.length >0){
            for(var item in files){
                var tmpath= files[item]['path'];
                var tmparr =files[item]['name'].split('.');
                var ext ='.'+tmparr[tmparr.length-1];
                var newpath =path.join('upload', parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext);
                console.log("tmp" + tmpath);
                console.log("new" + newpath);
                var stream = fs.createWriteStream(newpath);//创建一个可写流
                fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
            }
       // }
        this.redirect('/');

    });*/

    router.post('/img' , function *(next){
        var parts = parse(this);
        var part;

        while (part = yield parts){
            var stream = fs.createWriteStream('tmp/' + part.filename);
            part.pipe(stream);
            //console.log(part);
            console.log('upload %s --> %s',part.filename, stream.path);
            var client = qn.create({
                accessKey: 'qgEdPE_-N9w0Ln_ckceM6B1PoJhl0-BCkTnuQKre',
                secretKey: 'QXemEA4LSNpywF3BiUNYkID5L0ur3-dfKYeVrr8N',
                bucket: 'nbut-club',
                origin:'7xrkb1.com1.z0.glb.clouddn.com'

            });

            console.log(stream.path);
            client.uploadFile(stream.path,{key:'dsada.png'},function(err, result){
                console.log(result);
            });
        }
        this.redirect('/');
    });

    router.post('/star', function *(){
        var data = this.request.body;
        data.user = this.session.user;
        console.log(data);
        yield [
            $Star.addStar(data),
            $Good.incStarById(data.good_id)
        ];
        var cddata = yield $Good.getGoodById(data.good_id);
        var Data = {
            "star": cddata.star,
            "status": "取消收藏"
        };
        this.redirect('back');
        this.status = 200;
        this.body = Data;
    });

    router.post('/delstar', function *() {
        var data = this.request.body;
        data.name = this.session.user.name;
        console.log(data);
        yield [
            $Star.delStar(data.name, data.good_id),
            $Good.subStarById(data.good_id)
        ];
        var cbdata = yield $Good.getGoodById(data.good_id);
        var Data = {
            "star" : cbdata.star,
            "status": "收藏"
        };
        this.redirect('back');
        this.status = 200;
        this.body = Data;
    });


    //404页面
    router.get('/404', function *() {
        yield this.render('404');
    });

    //about页面
    router.get('/about', function *() {
        yield this.render('about',{
            messageCount: 0
        });
    });

    //头像测试
    router.get('/touxiang',function *(){
        yield this.render('putup', {
            m_gravatars: [
                gravatar.url('8695931@qq.com', {s: '100', r: 'x', d: 'retro'}),
                gravatar.url('8695931@hotmail.com', {s: '100', r: 'x', d: 'retro'}),
                gravatar.url('869595931@126.com', {s: '100', r: 'x', d: 'retro'}),
                gravatar.url('931@qq.com', {s: '100', r: 'x', d: 'retro'}),
                gravatar.url('86931@126.com', {s: '100', r: 'x', d: 'retro'})
            ],
            messageCount: 0
        });
    });


    //discovery 页面
    router.get('/discovery',function *(){
       yield this.render('discovery',{
           messageCount: 0
       });
    });

    router.get('/ask', function *() {
        yield this.render('ask',{
            messageCount: 0
        });
    });


    app
        .use(router.routes())
        .use(router.allowedMethods());
};

////www.gravatar.com/avatar/f920253329292676f9afa983d01ac62e?s=100&r=x&d=retro