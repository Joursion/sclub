/**
 * Created by m on 16-2-17.
 */

var mongoose = require('mongoose');
var config = require('config-lite').mongodb;

mongoose.connect(config.url, function (err) {
    if (err) {
        console.log('connect to %s error: ', config.url, err.message);
        process.exit(1);
    }
});

exports.User = require('./user');
exports.Good = require('./good');
exports.Activity = require('./activity');
exports.ActivityCommnet = require('./activity_comment');
exports.Join = require('./join');
exports.GoodComment = require('./good_comment');
exports.Star = require('./star');
exports.Message = require('./message');