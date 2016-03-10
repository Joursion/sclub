/**
 * Created by m on 16-3-9.
 */
var gravatar = require('gravatar');
var moment = require('moment');
var md = require('markdown-it')();


module.exports = {
    get fromNow () {
        return function (date) {
            return moment(date).fromNow();
        };
    },
    get gravatar () {
        return gravatar.url;
    },
    get markdown () {
        return function (content) {
            return md.render(content);
        };
    }
};