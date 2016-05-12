/**
 * Created by m on 16-2-17.
 */
var Good = require('../models').Good;
var cache = require('co-cache');

exports.addGood = function (data) {
    return Good.create(data);
};

exports.getGoodById = function(id) {
    return Good.findOneAndUpdate({_id: id}, {$inc: {pv: 1}}).exec();
};

//查询该用户所上架的goods
exports.getGoodsByName = function (name) {
    return Good.find({'seller.name': name}).sort('-update_at').exec();
};

//根据标签来获取good
/*exports.GetGoodByTab = cache(function getGoodByTab(tab, p) {
    var query = {};
    if (tab) {query.tab = tab; }
    return Good.find(query).skip((p - 1) * 20).sort('update_at').limit(20).select('-content').exec();
}, {
    key : function (tab, p) {
        tab = tab || 'all';
        return this.name + ':' + tab + ':' + p;
    }
});*/


exports.GetGoodByTab = function getGoodbytab(tab, p) {
    var query = {};
    if (tab !== 'all') {
        query.tab = tab;
    }
    return Good.find(query).skip((p - 1)*20).sort('update_at').limit(20).select('-conetent').exec();
};

exports.getGoodsCount = function getGoodsCount(tab){
    var query = {};
    if (tab !== 'all'){
        query.tab = tab;
    }
    return Good.count(query).exec();
};

exports.incCommentById = function(id) {
    return Good.findByIdAndUpdate({_id: id}, {$inc: {comment: 1}}).exec();
};

exports.editGood = function (id, data) {
    return Good.findOneAndUpdate({_id : id}, {$set: {
        update_at: data.update_at,
        prices: data.prices,
        content: data.content,
        good_url: data.good_url
    }});
};

//获取热门的三个闲置
exports.getHotGoods = function (){
    return Good.find().sort('-comment').limit(5).exec();
};

exports.subStarById = function (id) {
    return Good.findByIdAndUpdate(id,{$inc: {star: -1}}).exec();
};

exports.incStarById = function (id) {
    return Good.findByIdAndUpdate(id,{$inc: {star: 1}}).exec();
};
