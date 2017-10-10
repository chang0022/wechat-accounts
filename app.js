'use strict'

const Koa = require('koa');
const path = require('path');

const wechat = require('./wechat/middleware');
const util = require('./libs/utils');

const wechat_file = path.join(__dirname, './config/wechat.txt');
const config = {
    wechat: {
        appID: 'wx001e2f72ebd7a312',
        appSecret: '71cd994a8e60be877bd1533d63ba9199',
        token: 'thisisneochangwechat',
        getAccessToken() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
};

const app = new Koa();

app.use(wechat(config.wechat));

app.listen(1314);