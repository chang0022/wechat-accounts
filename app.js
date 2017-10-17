'use strict'

const Koa = require('koa');
const jsSHA = require('jssha');
const ejs = require('ejs');
const heredoc = require('heredoc');

const wechat = require('./wechat/middleware');
const path = require('path');
const util = require('./libs/utils');
const config = require('./config')
const weixin = require('./wx/reply');
const Wechat = require('./wechat/wechat')

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
    <h1 id="h1">点击标题，开始录音翻译</h1>
    <p id="title"></p>
    <div id="directors"></div>
    <div id="year"></div>
    <div id="poster"></div>
</body>
<script src="https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
wx.config({
    debug: false,
    appId: 'wx001e2f72ebd7a312',
    timestamp: '<%= timestamp %>',
    nonceStr: '<%= nonceStr %>',
    signature: '<%= signature %>',
    jsApiList: [
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'translateVoice'
    ]
});
wx.ready(function() {
    var isRecording = false;
    $('#h1').click(function() {
        if(!isRecording) {
            isRecording = true;
            wx.startRecord({
                cancel: function() {
                    console.log('请开启麦克风');
                }
            });

            return '';
        }
        isRecording = false;
        wx.stopRecord({
            success: function (res) {
                var localId = res.localId;

                wx.translateVoice({
                    localId: localId,
                    isShowProgressTips: 1,
                    success: function (res) {
                        console.log(res.translateResult);
                        alert(res.translateResult);
                    }
                });
            }
        });
    });
});
</script>
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
    let shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(string);
    ret.signature = shaObj.getHash('HEX');
    return ret;
};

app.use(async (ctx, next) => {
    if (ctx.url.indexOf('/movie') > -1) {
        const wechatApi = new Wechat(config.wechat);
        const data = await wechatApi.fetchAccessToken();
        const access_token = data.access_token;

        const tickeData = await wechatApi.fetchTicket(access_token);
        const ticket = tickeData.ticket;
        const url = ctx.href;

        const param = sign(ticket, url);
        ctx.body = ejs.render(tpl, param);
        return next;
    }
    await next();
})
app.use(wechat(config.wechat, weixin.reply));

app.listen(1314);