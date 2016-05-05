
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: {type: String, required: true},
    founder: {
        name: {type: String, required: true},
        email: {type: String, required: true},
        tx_url:{type: String}
    },
    create_at: {type: Date, required: true, default: Date.now()},
    content: {type: String, required: true},
    solved: {type: String, required: true, default :false},
    pv: {type: Number, required: true, default: 0},
    comment: {type: Number, required:true, default: 0}
});

module.exports = mongoose.model('question', questionSchema);
