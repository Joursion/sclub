/**
 * Created by m on 16-2-18.
 */
var Activity = require('../models').Activity;
var cache = require('co-cache');

exports.addActivity = function (data) {
    return Activity.create(data);
};

exports.editActivity = function (id, data) {
    return Activity.findOneAndUpdate({_id : id}, {$set: {
        update_date: data.update_date,
        activity_date: data.activity_date,
        deadline: data.deadline,
        content: data.content,
        number_limit: data.number_limit
    }});
};


exports.getActivityById = function (id) {
    return Activity.findOneAndUpdate({_id: id},{$inc: {pv : 1}}).exec();
};

exports.incCommentById = function (id) {
    return Activity.findByIdAndUpdate(id, {$inc: {comment: 1}}).exec();
};

//添加参加的人员信息  to join models
exports.addJoinPeople = function (id, people) {
    return Activity.findByIdAndUpdate(id, {$set: {people: people}});
};

/// 增加参加人数，在activity　models　中，不进行记录joiner

exports.incJoinById = function(id) {
    return Activity.findByIdAndUpdate({"_id": id}, {$inc: {join: 1}}).exec();
};

exports.subJoinById = function (id) {
    return Activity.findByIdAndUpdate({"_id": id}, {$inc: {join: -1}}).exec();
};

exports.GetActivityByTab = function (p) {
    return Activity.find().skip((p - 1) * 10).limit(10).sort('update_at').exec();
};

exports.deleteActivity = function (id) {
    return Activity.findByIdAndRemove(id);
};

exports.getActivityByName = function (name) {
    return Activity.find({name: name})
};

exports.getActivityCount = function () {
  return Activity.count().exec();
};

exports.getHotActivity = function () {
    return Activity.find().sort('pv').limit(3).exec();
};
