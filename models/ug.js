/**
 * Created by m on 16-3-21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ugSchema = new Schema({
    user: {type: String, required: true},
    status: {type: Number, required: true},
    time: {type: Number, required:true},
    content: {type: String, required: true}
});

module.exports = mongoose.model('ug',ugSchema);