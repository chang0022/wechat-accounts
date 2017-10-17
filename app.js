'use strict'

const Koa = require('koa');

const wechat = require('./wechat/middleware');
const path = require('path');
const util = require('./libs/utils');
const config = require('./config')
const weixin = require('./wx/reply');
const jsSHA = require('jssha');
const ejs = require('ejs');
const heredoc = require('heredoc');

const app = new Koa();

const tpl = heredoc(() => {/*
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>猜电影</title>
    </head>
    <body>
        <h1>点击标题，开始录音翻译</h1>
        <p id="title"></p>
        <div id="poster"></div>
    </body>
    <script src="https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    </html>
*/});

const createNonceStr = () => {
    return Math.random().toString(36).substr(2, 15);
};

const createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000) + '';
};

const raw = (args) => {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

const sign = (jsapi_ticket, url) => {
    let ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    let string = raw(ret);
    let shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');
    return ret;
};

app.use(async (ctx, next) => {
    if (ctx.url.indexOf('/movie') > -1) {
        ctx.body = ejs.render(tpl, {});
        return next;
    }
    await next();
})
app.use(wechat(config.wechat, weixin.reply));

app.listen(1314);