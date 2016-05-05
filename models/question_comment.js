/**
 * Created by m on 16-5-4.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var questionCommentSchema = new Schema({
    question_id: {type: ObjectId, required: true},
    user: {
        name: {type: String, required: true},
        email: {type: String, required: true},
        tx_url:{type: String}
    },
    content: {type: String, required: true},
    create_at: {type: Date, required: true, default :Date.now()}
});

questionCommentSchema.index({question_id: 1, create_at: 1});

module.exports = mongoose.model('questionComment',questionCommentSchema);