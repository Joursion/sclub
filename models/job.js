/**
 * Created by m on 16-4-30.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    title: {type: String},
    content: {type: String},
    create_at: {type: Date, default: Date.now()},
    pv: {type: Number}
});

module.exports = mongoose.model('Job',JobSchema);