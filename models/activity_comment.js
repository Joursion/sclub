/**
 * Created by m on 16-2-18.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var activityCommentSchema = new Schema({
    activity_id: {type: ObjectId, required: true},
    user: {
        name: {type: String, required: true},
        email: {type: String, required: true}
    },
    content: {type: String, required: true},
    create_at: {type: Date, required: true}
});

activityCommentSchema.index({activity_id: 1, update_at: 1});

module.exports = mongoose.model('activityComment',activityCommentSchema);