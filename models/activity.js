/**
 * Created by m on 16-2-18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ActivitySchema = new Schema({
    title: {type: String, required: true, default:"我暂时还没有标题"},
    founder: {
        name: {type: String, required: true},
        email: {type: String, required: true},
        tx_url:{type: String}
    },
    create_at: {type: Date, default: Date.now()},
    update_at: {type: Date, default: Date.now()},
    activity_date: {type: String},
    deadline: {type: String, required: true, default:"待定"},
    content: {type: String, required: true, default: "待完善"},
    number_limit: {type: String, required: true, default:"待定"},
    join: {type: Number, required: true, default: 0},
    pv: {type: Number, default: 0},
    comment: {type: Number, default: 0},
    isend: {type: Boolean, default: false}
});

ActivitySchema.index({update_date:1});

module.exports = mongoose.model('Activity', ActivitySchema);


