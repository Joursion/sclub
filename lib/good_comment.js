/**
 * Created by m on 16-2-18.
 */
var GoodComment = require('../models').GoodComment;
var cache = require('co-cache');

exports.addGoodComment = function (data) {
    return GoodComment.create(data);
};

exports.getGoodComment = function (id) {
    return GoodComment.find({good_id: id}).sort('create_at').exec();
};

