/**
 * Created by m on 16-2-28.
 */
var mongoose = require('mongoose');
var Star = require('../models').Star;

exports.addStar = function (data) {
    return Star.create(data);
};

exports.delStar = function (user, id) {
    return Star.findOneAndRemove({'user.name': user.name, good_id: id}).exec();
};

exports.getStarByName = function (user) {
    return Star.find({'user.name': user.name}).exec();
};