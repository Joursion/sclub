/**
 * Created by m on 16-2-28.
 */

var Message = require('../models').Message;

exports.addMessage = function (data) {
    return Message.create(data);
};

exports.getMessageByName = function (name) {
    return Message.find({'target': name, 'has_read': false}).exec();
};

exports.CountMyMessage = function (name) {
    return Message.count({target: name, has_read: false}).exec();
};

exports.readMessage = function (name) {
    return Message.update({target: name},{$set:{has_read: true}},{multi: true }).exec();
};


/*
exports.readMessage = function (name) {
    return Message.find({target: name}, {$set: {has_read: true}}).exec();
};*/

