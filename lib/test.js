/**
 * Created by m on 16-2-21.
 */

var Models = require('../../lib/core');
var $Activity = Models.$Activity;
var $ActivityComment = Models.$ActivityComment;

exports.post = function *(id) {
    yield $Activity.incJoinById(id);
    this.redirect(id);
};
