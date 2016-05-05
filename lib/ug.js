/**
 * Created by m on 16-3-21.
 */
var Ug = require('../models').Ug;

exports.getStatus = function (name) {
    return Ug.findOne({user: name}).exec();
};

exports.upStatus = function (name) {
    return Ug.findOneAndUpdate({user:name}, {$set: {status: 1}})
};

exports.removeU = function (name) {
    return Ug.findOneAndRemove({user: name}).exec();
};

exports.addUg = function (data) {
    return Ug.create(data);
};