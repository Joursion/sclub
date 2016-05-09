/**
 * Created by m on 16-5-6.
 */

var Models = require('../lib/core');
var $Message = Models.$Message;

exports.notify = function *(sender, target, content, url, type) {
    var data = {
        sender: sender,
        target: target,
        content: content,
        url: url,
        type: type
    };

    yield $Message.addMessage(data);
};