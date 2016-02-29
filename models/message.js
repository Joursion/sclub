


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
@params
content: 推送的消息内容
sender: 消息的发送者
target: 消息传达者
type:消息的类型
*/
var messageSchema = new Schema({
    content: {type: String},
    type: {type: String},
    sender: {type: String},
    target: {type: String},
    url: {type: String},
    create_at: {type: Date, required: true},
    has_read: {type: Boolean, required: true}
});

messageSchema.index({target: 1});


module.exports = mongoose.model('Message', messageSchema);