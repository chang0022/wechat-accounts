'use strict'

const path = require('path');
const util = require('../libs/utils');

const access_token = path.join(__dirname, '../storage/access_token.json');
const jsapi_ticket = path.join(__dirname, '../storage/jsapi_ticket.json');

const config = {
    wechat: {
        appID: 'wx001e2f72ebd7a312',
        appSecret: '71cd994a8e60be877bd1533d63ba9199',
        token: 'thisisneochangwechat',
        getAccessToken() {
            return util.readFileAsync(access_token);
        },
        saveAccessToken(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(access_token, data);
        },
        getTicket() {
            return util.readFileAsync(jsapi_ticket);
        },
        saveTicket(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(jsapi_ticket, data);
        }
    }
};

module.exports = config;
