/**
 * Created by m on 16-2-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoodSchema = new Schema({
    seller: {
        name: {type: String, required: true},
        email: {type: String, required: true}
    },
    content:{type: String},
    create_at: {type: Date},
    update_at: {type: Date},
    name: {type: String},
    prices: {type: Number},
    good_url: {type: String},
    comment:{type: Number},
    pv: {type: Number},
    star: {type: Number}
});


module.exports = mongoose.model('Good', GoodSchema);
