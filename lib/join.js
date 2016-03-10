/**
 * Created by m on 16-2-22.
 */
var Join = require('../models').Join;

exports.addJoin = function (data) {
    return Join.create(data);
};

exports.delJoin = function (name, id) {
    return Join.findOneAndRemove({'user.name' : name, activity_id: id}).exec();
};

exports.IsJoin = function (name, id) {
    return Join.find({'user.name' : name ,activity_id: id}).exec();/*,function(err, result){
        if (err) {
            console.log('error' + err.message);
        } else {
            console.log('result' + result);
        }*/

};

exports.getJoinById = function(id) {
    return Join.find({"activity_id": id}).exec();
}

exports.getJoinByName = function (name) {
    return Join.find({'user.name': name}).exec();
};