/**
 * Created by m on 16-2-16.
 */

var path = require('path');

module.exports = {
    port: process.env.PORT || 3000,
    mongodb: {
        url: 'mongodb://127.0.0.1:27017/sclub'
    },
    schemeConf: path.join(__dirname, '../config/scheme.js'),
    staticCacheConf: path.join(__dirname, '../view/publices'),
    renderConf: path.join(__dirname, '../view/config'),
    routerConf: 'routes',
    routerCacheConf: {
        '/': {
            expire: 10 * 1000,
            condition: function() {
                return !this.session || !this.session.user;
            }
        }
    }
};