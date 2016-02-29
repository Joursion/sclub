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

//Hot
exports.getActivity = function () {
    return Activity.find({pv: 0 }).exec();
};

exports.getActivityById = function (id) {
    return Activity.findOne({_id: id}).exec();
};

exports.incCommentById = function (id) {
    return Activity.findByIdAndUpdate(id, {$inc: {comment: 1}}).exec();
};

//添加参加的人员信息
exports.addJoinPeople = function (id, people) {
    return Activity.findByIdAndUpdate(id, {$set: {people: people}});
};

exports.GetActivityByTab = function (tab, p) {
    var query = {};
    if (tab) {
        query.tab = tab;
    }
    return Activity.find(query).skip((p - 1) * 10).limit(10).sort('update_at').exec();
};

exports.deleteActivity = function (id) {
    return Activity.findByIdAndRemove(id);
};

exports.getActivityByName = function (name) {
    return Activity.find({name: name})
};
