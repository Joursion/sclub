/**
 * Created by m on 16-4-30.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    title: {type: String, default: "标题不知道那里去了"},
    content: {type: String},
    create_at: {type: Date, default: Date.now()},
    pv: {type: Number, default: 0}
});

module.exports = mongoose.model('Job',JobSchema);