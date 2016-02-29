/**
 * Created by m on 16-2-16.
 */
var User = require('./user');
var Good = require('./good');
var Activity = require('./activity');
var ActivityComment = require('./activity_comment');
var GoodComment = require('./good_comment');
var Join = require('./join');
var Star = require('./star');
var Message = require('./message');

module.exports = {
    get $User () {
        return User;
    },
    get $Good　() {
        return Good;
    },
    get $Activity () {
        return Activity;
    },
    get $ActivityComment () {
        return ActivityComment;
    },
    get $GoodComment () {
        return GoodComment;
    },
    get $Join () {
        return Join;
    },
    get $Star() {
        return Star;
    },
    get $Message() {
        return Message;
    }
};


