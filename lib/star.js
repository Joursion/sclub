/**
 * Created by m on 16-2-28.
 */
var mongoose = require('mongoose');
var Star = require('../models').Star;

exports.addStar = function (data) {
    return Star.create(data);
};

exports.delStar = function (name, id) {
    return Star.findOneAndRemove({'user.name': name, good_id: id}).exec();
};

exports.getStarByName = function (name) {
    return Star.find({'user.name': name}).exec();
};

exports.getStarById = function(id) {
    return Star.find({"good_id": id}).exec();
};

exports.IsStar = function(name, id) {
    return Star.find({"user.name":name, good_id: id}).exec();
};