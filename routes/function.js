var Models = require('../lib/core');
var $Activity = Models.$Activity;
var $ActivityComment = Models.$ActivityComment;
var $User = Models.$User;
var $Good = Models.$Good;
var $GoodComment = Models.$GoodComment;
var $Join = Models.$Join;
var $Star = Models.$Star;
var $Message = Models.$Message;
var $Ug = Models.$Ug;
var $Job = Models.$Job;
var $Question = Models.$Question;
var $QuestionComment = Models.$QuestionComment;

exports.isAdmin = function (name) {
    var user = $User.getUserByName(name);
    return user.isAdmin;
}