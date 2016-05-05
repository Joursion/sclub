/**
 * Created by m on 16-5-4.
 */
var QuestionComment = require('../models').QuestionComment;
var cache = require('co-cache');

exports.addQuestionComment = function (data) {
    return QuestionComment.create(data);
};

exports.getQuestionComment = function (id) {
    return QuestionComment.find({question_id: id}).sort('create_at').exec();
};