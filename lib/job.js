/**
 * Created by m on 16-4-30.
 */
var Job = require('../models').Job;

exports.addJob = function (data) {
    return Job.create(data);
};

exports.getJob = function () {
    return Job.find().limit(10).sort('-create_at').exec();
};

exports.getJobById = function (id) {
    return Job.findOneAndUpdate({_id: id}, {$inc: {pv : 1}}).exec();
};

exports.getHotJob = function () {
    return Job.find().limit(5).sort('-pv').exec();
};

exports.adminGet = function () {
    return Job.find().sort('create_at').exec();
};
