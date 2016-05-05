/**
 * Created by m on 16-2-16.
 */
var User = require('../models').User;

exports.addUser = function (data) {
    return User.create(data);
};

exports.getUserById = function (id) {
    return User.findOne({_id: id}).exec();
};

exports.getUserByName = function (name) {
    return User.findOne({name: name}).exec();
};

exports.adminGet = function () {
    return User.find().sort('update_at').exec();
};

exports.updateState = function (name){
    return User.findOneAndUpdate({name: name}, {$set: {state: 1}}).exec();
};