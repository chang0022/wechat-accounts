'use strict'

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('./wechat');
const util = require('./util');

module.exports = opts => {
    // const wechat = new Wechat(opts);

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

            const content = await util.parseXMLAsync(data);
            const message = util.formatMessage(content.xml);
            

            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    const now = new Date().getTime();

                    ctx.status = 200;
                    ctx.type = 'application/xml';
                    const reply = `<xml>
                    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                    <CreateTime>${now}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[欢迎关注！！！]]></Content>
                    </xml>`;
                    ctx.body = reply;
                    return '';
                }
            }

            if (message.MsgType === 'text') {
                const now = new Date().getTime();
                
                ctx.status = 200;
                ctx.type = 'application/xml';
                const reply = `<xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${now}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[嗯嗯]]></Content>
                </xml>`;
                ctx.body = reply;
                return '';
            }
        }

    }
}
