/**
 * Created by m on 16-2-17.
 */
var gravatar = require('gravatar');
var moment = require('moment');
var md = require('markdown-it')();

moment.locale('zh-cn');

module.exports = {
    get fromNow () {
        return function (date) {
            return moment(data).fromNow();
        };
    },

    get gravatar () {
        return gravatar.url;
    },

    get markdown () {
        return function (content) {
            return md.render(content);
        }
    }
};

