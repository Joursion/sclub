/**
 * Created by m on 16-2-18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ActivitySchema = new Schema({
    title: {type: String, required: true},
    founder: {
        name: {type: String, required: true},
        email: {type: String, required: true}
    },
    create_date: {type: Date, required: true},
    update_date: {type: Date, required: true},
    activity_date: {type: String},
    deadline: {type: String, required: true},
    content: {type: String, required: true},
    number_limit: {type: String, required: true},
    join: {type: Number, required: true},
    pv: {type: Number},
    people: {
        name: {type: String},
        email: {type: String}
    },
    comment: {type: Number}
});

ActivitySchema.index({update_date:1});

module.exports = mongoose.model('Activity', ActivitySchema);


