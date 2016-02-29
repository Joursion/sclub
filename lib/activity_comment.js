/**
 * Created by m on 16-2-20.
 */
var ActivityComment = require('../models').ActivityCommnet;
var cache = require('co-cache');

exports.addActivityComment = function (data) {
    return ActivityComment.create(data);
};

exports.getActivityComment = function (activity_id) {
    return ActivityComment.find({activity_id: activity_id}).exec();
};


