/**
 * Created by m on 16-2-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: Number},　//标记是否已经进行邮箱激活
    password: {type: String, required: true},
    reg_date: {type: Date, required: Date.now},
    tx_url:{type: String}
});

UserSchema.index({name: 1});

module.exports = mongoose.model('User', UserSchema);
