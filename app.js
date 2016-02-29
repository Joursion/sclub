var app = require('koa')();
var router = require('koa-router')();
var logger = require('koa-logger');
var bodyParser =require('koa-bodyparser');
var staticCache = require('koa-static-cache');
var errorHandler = require('koa-errorhandler');
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo'); //需要通过mongodb来存储session
var flash = require('koa-flash');
var gzip = require('koa-gzip');
var scheme = require('koa-scheme');
var routerCache = require('koa-router-cache');
var render = require('co-ejs');
var config = require('config-lite'); //默认加载当前目录下的config目录下的default文件

var merge = require('merge-descriptors');
var core = require('./lib/core');
var renderConf = require(config.renderConf);
//  merge(renderConf.locals || {}, core, false);
app.keys = ['dsd'];

app.use(errorHandler());
app.use(bodyParser());
app.use(staticCache(config.staticCacheConf));
app.use(logger());
//调用mongodb存储session
app.use(session({
    store: new MongoStore(config.mongodb)
}));
app.use(flash());
app.use(scheme(config.schemeConf));
app.use(routerCache(app,config.routerCacheConf));
app.use(gzip());
app.use(render(app, renderConf));

var st = require('./routes/app.js');
st(app, router);

app.listen(config.port, function () {
    console.log('Server listening on ', config.port);
});

