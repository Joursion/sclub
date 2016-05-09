var Question = require('../models').Question;

exports.addQuestion = function (data) {
    return Question.create(data);
};

exports.deleteQuestion = function (id) {
    return Question.findOneAndRemove({
        _id: id
    }).exec();
};

exports.getQuestion = function () {
    //return Question.find().limit(20).sort('create_at').exec();
    return Question.find().limit(20).sort('-create_at').exec();
};

exports.getQuestionById = function (id) {
    return Question.findOneAndUpdate({_id: id},{$inc: {pv : 1}}).exec();
};

exports.getNewQuestion = function () {
    return Question.find({solved: false}).sort('create_at').limit(4).exec();
};

exports.getHotQuestion = function () {
    return Question.find({solved: false}).sort('-pv').limit(4).exec();
};

exports.solveQuestion = function (id) {
    return Question.findOneAndUpdate({_id: id},{$set: {solved: true}}).exec();
};

exports.incCommentById = function (id) {
    return Question.findOneAndUpdate({id: id}, {$inc: {comment: 1}}).exec();
};


