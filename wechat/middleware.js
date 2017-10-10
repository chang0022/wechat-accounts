'use strict'

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('./wechat');

module.exports = opts => {
    const wechat = new Wechat(opts);

    return async ctx => {
        const token = opts.token;
        const signature = ctx.query.signature;
        const nonce = ctx.query.nonce;
        const timestamp = ctx.query.timestamp;
        const echostr = ctx.query.echostr;

        const str = [token, timestamp, nonce].sort().join('');

        const sha = sha1(str);

        if (ctx.method === 'GET') {
            if(sha === signature) {
                ctx.body = echostr + '';
            } else {
                ctx.body = 'Wrong'
            }
        } else if(ctx.method === 'POST') {
            if(sha !== signature) {
                ctx.body = 'Wrong'
                return false;
            }

            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset
            });

            console.log(data.toString());
        }

    }
}
