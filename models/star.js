/**
 * Created by m on 16-2-18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var StarSchema = new Schema({
    user: {
        name: {type: String, required: true},
        email: {type: String, required: true}
    },
    good_id: {type: ObjectId, required: true}
});

module .exports = mongoose.model('Star',StarSchema);