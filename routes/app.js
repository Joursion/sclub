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
var $Ug = Models.$Ug;
var $Job = Models.$Job;
var $Question = Models.$Question;
var $QuestionComment = Models.$QuestionComment;

/*测试代码片段*/
var markdown = require('markdown').markdown;
var formidable = require('formidable');
var qn = require('qn');
var koaBody = require('koa-body')();
var parse = require('co-busboy');
var fs = require('fs');
var path = require('path');
var gravatar = require('gravatar');
var uuid = require('node-uuid');

var a_mail = require('./sendmail');
var md5 = require('./md5');
var msg = require('./notify');
var isAdmin = require('./function').isAdmin;
var config = require('./config').default;
/*
var multer = require('koa-multer');
var upload = multer({dest: 'tmp/'});*/

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
            this.flash = {error: '用户名或者密码错误！'};
            this.status = 200;
            this.redirect('back');
            return false;
        }

        /*if(UserInfo && UserInfo.state == 0) {
            this.flash = {error: '用户不存在或者还没进行邮箱激活!'};
            this.status = 200;
            this.redirect('back');
            return false;
        }*/
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
            this.status = 200;
            this.redirect('back');
        } else {
            //生成激活链接
            var time = Date.now().toString();
            var a_url = md5.md5(data.name) + uuid.v4() + md5.md5(time);
            console.log(a_url);
            var ug_data = {
                user: data.name,
                time: 100,
                content: a_url,
                status: 0
            };
            yield [
                $User.addUser(data),
                $Ug.addUg(ug_data)
            ];
            a_mail.send(data.name, data.email, a_url);

            this.flash = {success: '注册成功,请到邮箱内进行激活操作'};
            this.redirect('/');
        }
    });


    router.get('/a/:user/:ac', function *() {
        var user = this.params.user;
        var ac = this.params.ac;
        var UserExit =  yield $Ug.getStatus(user);
        console.log(UserExit);
        if ( ! UserExit) {
            //this.flash = {error: "出现错误，稍后重试"};
            console.log("error");
        }
        if(UserExit.status == 0 && ac == UserExit.content) {
            yield [
                $User.updateState(user),
                $Ug.removeU(user)
            ];
            var data = yield $User.getUserByName(user);
            this.session.user = {
                name: data.name,
                email: data.email,
                tx_url: data.tx_url
            };
            console.log('激活成功');
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
        } else {
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
       // data.user.tx_url = this.session.user.tx_url;
        data.create_at = Date.now();

        if (data.activity_founder !== data.user.name)
        var message = {
            type: "回复了你的活动",
            sender: this.session.user.name,
            target: data.activity_founder,
            url: "/activity/" + data.activity_id,
            content : data.activity_title,
            has_read: false,
            create_at : Date.now()
        };

        yield [
            $ActivityComment.addActivityComment(data),
            $Activity.incCommentById(data.activity_id),
            $Message.addMessage(message)
        ];
        this.redirect('back');
        this.status = 200;
        this.body = data;
    });

    //activity 参加
    router.post('/join', function *() {
        var data = this.request.body;
        data.user = this.session.user;
        data.tx_url = this.session.tx_url;
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
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('activity_create',{
            messageCount: MessageCount
        });
    });

    router.post('/activity_create', function *() {
        var data = this.request.body;
        //data.title = "dsds";
        data.founder = this.session.user;
        yield $Activity.addActivity(data);
        this.flash = {success: '发布活动成功'};
        this.redirect('/activity/p/1');
    });

    //activity 修改
    /*router.get('/activity_edit/:id', function *() {
        var id = this.params.id;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('activity_edit', {
            activity: $Activity.getActivityById(id),
            messageCount : MessageCount
        });
    });*/

   /* router.post('/activity_edit/:id', function *() {
        var id = this.params.id;
        var data = this.request.body;
        data.update_date = Date.now();
        console.log(data);
        yield $Activity.editActivity(id, data);
        this.flash = {success: '修改活动成功'};
        this.redirect('/activity/'+ id);
    });*/

    //activity 删除
    router.post('/activity_del', function *() {
        var data = this.request.body;
        yield $Activity.deleteActivity(data.activity_id);
    });

    //good 首页
   /* router.get('/good', function *() {
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
    });*/

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
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('good_create',{
            messageCount: MessageCount
        });
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

        this.redirect('/good/all/1');

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
        } else {
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

  /*  router.get('/good_edit/:id', function *() {
        var id = this.params.id;
        var MessageCount = 0;
        if (this.session.user) {
            MessageCount = yield $Message.CountMyMessage(this.session.user.name);
        }
        yield this.render('good_edit',{
            good: $Good.getGoodById(id),
            messageCount: MessageCount
        });
    });
*/
   /* router.post('/good_edit/:id', function *() {
        var id = this.params.id;
        var data = this.request.body;
        data.update_at = Date.now();
        console.log(data);
        yield $Good.editGood(id, data);
        this.flash = {success: '修改商品成功'};
        this.redirect('/good/' + id);
    });*/

    router.post('/good_comment_submit', function *() {
        var all = this.request.body || {};
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
            $Good.incCommentById(data.good_id)
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
        this.status = 200;
        this.body = data;
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

    router.get('/message', function *() {/*
        yield $Message.(this.session.user.name);*/

        yield this.render('message', {
            messages: $Message.getMessageByName(this.session.user.name),
            messageCount: 0
        });
    });

    router.post('/read_message', function *() {
        var data = this.request.body;

        yield $Message.readMessage(data.name);
        this.redirect('back');
        this.status = 200;
    });


    /*
    * 测试formidable
    *
    * */

    router.get('/img', function *() {
        var uid = uuid.v4();
        console.log(uid);
        yield this.render('testimg',{
            messageCount: 0
        });
    });

/* 使用的co-busbody*/
    router.post('/img' , function *(next){

        var parts = parse(this);
        var part;
        var file_src;
        while (part = yield parts) {
            var stream = fs.createWriteStream('tmp/' + part.filename);
            file_src = "tmp/" + part.filename;
            part.pipe(stream);
            console.log('uploading %s -> %s', part.filename, stream.path);
        }

        /*使用qiniu*/
        var qiniu = require("qiniu");
        qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;
        var bucket = config.qiniu.bucket;
        var key = uuid.v4() + '.jpg';
        var cbdata;
        //构建上传策略函数
        function uptoken(bucket, key) {
            var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
            return putPolicy.token();
        }
        //生成上传 Token
        var token = uptoken(bucket, key);
        function uploadFile(uptoken, key, localFile) {
            var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
                if(!err) {
                    // 上传成功， 处理返回值
                    console.log(ret.key);
                    cbdata = ret.key;
                } else {
                    // 上传失败， 处理返回代码
                    console.log(err);
                }
            });
        }
        //调用uploadFile上传
        uploadFile(token, key, file_src);
        this.redirect('back');
        this.status = 200;
        this.body = key;
    });

  /*  router.post('/img', upload.single(''), function *() {

    })*/


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

    ///jobs pages

    router.get('/job', function *() {
        yield  this.render('job_index',{
            jobs: $Job.getJob(),
            Hotjobs: $Job.getHotJob(),
            messageCount: 0
        })
    });

    router.get('/job/:id', function *() {
        var id = this.params.id;
        var job = yield $Job.getJobById(id);
        var content = job.content;
        yield this.render('job',{
            job: job,
            content: markdown.toHTML(content),
            Hotjobs: $Job.getHotJob(),
            messageCount: 0
        })
    });

    router.get('/job_create', function *() {
        yield this.render('job_create',{
            messageCount: 0
        });
    });

    router.post('/job_create', function *() {
        var data = this.request.body;
        yield $Job.addJob(data);
        this.redirect('back');
        this.status = 200;
    });


    // question pages

    router.get('/q', function *() {
        var questions = yield $Question.getQuestion();
        var Hotquestion =  yield $Question.getHotQuestion();
        var Newquestion = yield $Question.getNewQuestion();
        yield this.render('question_index',{
            messageCount: 0,
            questions: questions,
            Hotquestion: Hotquestion,
            Newquestion: Newquestion
        });
    });


    router.get('/q/:id', function *() {
        var id = this.params.id;
        var question = yield $Question.getQuestionById(id);
        var Hotquestion =  yield $Question.getHotQuestion();
        var Newquestion = yield $Question.getNewQuestion();
        yield this.render('question',{
            question: question,
            Hotquestion: Hotquestion,
            Newquestion: Newquestion,
            messageCount: 0,
            question_comments: $QuestionComment.getQuestionComment(id)
        })
    });



    router.get('/question_create', function *() {
        yield this.render('question_create',{
            messageCount: 0
        });
    });

    router.post('/question_create', function *() {
        var data = this.request.body;
        data.founder = this.session.user;
        console.log(data);
        yield $Question.addQuestion(data);
        this.redirect('/q');
        this.status = 200;
    });

    router.post('/question_comment_submit', function *() {
        var all = this.request.body || {};
      //  console.log(all);
        var data = {};
        data.user = this.session.user;
        data.content = all.content;
        data.question_id = all.question_id;
        //data.remove(seller);
        console.log(data);
        //   console.log('---' + data);
        yield [
            $QuestionComment.addQuestionComment(data),
            $Question.incCommentById(data.question_id)
        ];
        this.redirect('back');
        this.status = 200;
        this.body = data;
    });

    // admin  pages

    router.get('/admin', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        yield this.render('admin',{
            messageCount: 0
        })
    });

    router.get('/admin_u', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        var users = yield $User.adminGet();
        yield this.render('adu',{
            messageCount: 0,
            users: users
        })
    });


    router.get('/admin_ask', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        yield this.render('adas',{
            messageCount: 0
        })
    });

    router.get('/admin_activity', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        yield this.render('ada',{
            messageCount: 0,
            activities: $Activity.adminGet()
        })
    });

    router.get('/admin_job', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        yield this.render('adj',{
            messageCount: 0,
            jobs: $Job.adminGet()
        })
    });

    router.get('/admin_ug', function *() {
        var name = this.session.user.name;
      
        if(isAdmin(name)) {
             this.redirect('/index');
        }
        yield this.render('adug',{
            messageCount: 0
            //: $Job.adminGet()
        })
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());
};
