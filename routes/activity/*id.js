/**
 * Created by m on 16-2-21.
 */
var Models = require('../../lib/core');
var $Activity = Models.$Activity;
var $ActivityComment = Models.$ActivityComment;

exports.get = function *(id) {
    yield this.render('activity',{
        activitys: $Activity.getActivityById(id),
        activity_comments: $ActivityComment.getActivityComment(id)
    })
};

exports.post = function *(id) {

    var data = this.request.body;
    console.log(data);
    data.user = this.session.user;
    data.create_at = Date.now();
    data.activity_id = id;
    console.log('submit');
    yield [
        $ActivityComment.addActivityComment(data),
        $Activity.incCommentById(id)
    ];
    /*if (dat.ss == "1") {
        var data = dat;
        data.remove(ss);
        data.user = this.session.user;
        data.create_at = Date.now();
        data.activity_id = id;
        console.log('submit');
        yield [
            $ActivityComment.addActivityComment(data),
            $Activity.incCommentById(id)
        ];
    }
    else {
        console.log('join');
        yield $Activity.incJoinById(id);
    }*/
    this.redirect(id);
};