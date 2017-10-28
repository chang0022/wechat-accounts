'use strict';

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('../libs/wechat/index');
const util = require('../libs/wechat/util');
const config = require('../config/wx.config');
const menuApi = require('../libs/wechat/menu')();
const menuConf = require('../libs/wechat/menuConf');

module.exports = (handler) => {
    menuApi.deleteMenu()
        .then(() => {
            return menuApi.createMenu(menuConf);
        })
        .then(msg => {
            console.log(msg)
        });
    return async (ctx, next) => {
        const token = config.wechat.token;
        const signature = ctx.query.signature;
        const nonce = ctx.query.nonce;
        const timestamp = ctx.query.timestamp;
        const echostr = ctx.query.echostr;

        const str = [token, timestamp, nonce].sort().join('');

        const sha = sha1(str);

        if (ctx.method === 'GET') {
            if (sha === signature) {
                ctx.body = echostr + '';
            } else {
                ctx.body = 'Wrong'
            }
        } else if (ctx.method === 'POST') {
            if (sha !== signature) {
                ctx.body = 'Wrong'
                return false;
            }
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset
            });

            const content = await util.parseXMLAsync(data);
            ctx.wxMsg = util.formatMessage(content.xml);

            await handler(ctx, next);

            Wechat.reply(ctx);
        }
    }
};
