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

module.exports = function (app, router) {

    // 登陆注册，登出
    router.get('logout', function *() {
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
            return this.render('signin');
        }

        this.session.user = {
            name: UserInfo.name,
            email: UserInfo.email
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
                email: data.email
            };

            this.flash = {success: '注册成功'};
            this.redirect('index');
        }
    });


    router.get('/', function *(){
        yield this.render('index');
    });

    // activity 首页
    router.get('/activity', function *() {
        var tab = this.query.tab;
        var p = this.query.p || 1;

        yield this.render('activity_index',{
            activitys : $Activity.GetActivityByTab(tab, p)
        });
    });

    //activity详细页面
    router.get('/activity/:id', function *() {
        var id = this.params.id;
        var user = this.session.user;
        console.log(id + "" + user.name);
        var st = yield $Join.IsJoin(user.name , id);
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
        yield this.render('activity',{
            activity: $Activity.getActivityById(id),
            activity_comments: $ActivityComment.getActivityComment(id),
            isJoin: join
        });
    });

    //activity 回复
    router.post('/activity_comment_submit', function *() {
        var data = this.request.body || {};
        data.user = this.session.user;
        data.create_at = Date.now();
        console.log(data);

     //   console.log('---' + data);
        yield [
            $ActivityComment.addActivityComment(data),
            $Activity.incCommentById(data._id)
        ];
        this.flash = {success: '回复成功'};
       // this.redirect('activity/'+ data.activity_id);
        this.redirect('back');
    });

    //activity 参加
    router.post('/join', function *() {
        var data = this.request.body;
        data.user = this.session.user;
        console.log(data);
        yield $Join.addJoin(data);
        this.flash = {success: '参加成功'};
        this.redirect('back');
    });

    //activity　取消参加
    router.post('/deljoin', function *() {
        var data = this.request.body;
        data.name =  this.session.user.name;
        console.log(data);
        yield $Join.delJoin(data.name, data.activity_id);
        this.flash = {success: '退出成功'};
        this.redirect('back');
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
        data.people = this.session.user;
        console.log(data);

        yield $Activity.addActivity(data);
        this.flash = {success: '发布活动成功'};
        this.redirect('activity');
    });

    //activity 修改
    router.get('/activity_edit/:id', function *() {
        var id = this.params.id;
        yield this.render('activity_edit', {
            activity: $Activity.getActivityById(id)
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
        yield this.render('good_index', {
            goods: $Good.GetGoodByTab(tab, p),
            messageCount: $Message.CountMyMessage(this.session.user.name)
        })
    });

    //good　创建
    router.get('/good_create', function *() {
        yield this.render('good_create');
    });

    router.post('/good_create', function *() {
        var data = this.request.body;
        data.seller = this.session.user;
        data.pv = 0;
        data.star = 0;
        data.comment = 0;
        data.create_at = Date.now();
        data.update_at = Date.now();
        yield $Good.addGood(data);
    });

    router.get('/good/:id', function *() {
        var id = this.params.id;
        yield this.render('good',{
            good: $Good.GetGoodById(id),
            good_comments: $GoodComment.getGoodComment(id)
        });
    });


    router.get('/good_edit/:id', function *() {
        var id = this.params.id;
        yield this.render('good_edit',{
            good: $Good.GetGoodById(id)
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
        //如果操作的不是自己相关的，创建新的消息，插入数据。
        if (seller != this.session.user.name) {
            var message = {};
            message.sender = this.session.user.name;
            message.target = seller;
            message.type = "回复了";
            message.content = all.good_name;
            message.url = "/good/" + all.good_id;
            message.create_at = Date.now();
            message.has_read = false;
            console.log(message);
            yield $Message.addMessage(message);
        }
        this.flash = {success: '回复成功'};
        // this.redirect('activity/'+ data.activity_id);
        this.redirect('/good/' + all.good_id);
    });

    router.get('/u/:id', function *() {
        var user_id = this.params.id;
        var userInfo = yield $User.getUserById(user_id);
        console.log(userInfo);
        if(userInfo == null || userInfo.length == 0) {
            return this.redirect('/404');
        } else {
            yield this.render('user',{
                user: userInfo,
                user_joins: $Join.getJoinByName(userInfo.name),
                user_goods: $Good.getGoodsByName(userInfo.name),
                user_stars: $Star.getStarByName(userInfo.name)
            });
        }
    });

    router.get('/u/message', function *() {
        var user_name = this.session.user.name;
        console.log(user_name);
        yield this.render('message',{
            messages: $Message.getMessageByName(user_name)
        })
    });

    //404页面
    router.get('/404', function *() {
        yield this.render('404');
    });




    app
        .use(router.routes())
        .use(router.allowedMethods());
};