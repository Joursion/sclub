/**
 * Created by m on 16-2-22.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var JoinSchema = new Schema({
    user: {
        name: {type: String, required : true},
        email: {type: String, required: true},
        tx_url: {type: String}
    },
    activity_id: {type: ObjectId, required: true}
}); 

module.exports = mongoose.model('Join',JoinSchema);