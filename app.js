'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const logger = require('koa-logger');

// const path = require('path');

// const wechat = require('./middleware/wechat');
// const util = require('./libs/utils');
// const config = require('./config/wx.config')
// const reply = require('./libs/wechat/reply');
// const Wechat = require('./libs/wechat')

// const sign = require('./libs/sign');

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(views(__dirname + '/views', {
    map: {
        hbs: 'handlebars'
    }
}))

// app.use(async (ctx, next) => {
//     if (ctx.url.indexOf('/movie') > -1) {
//         const wechatApi = new Wechat(config.wechat);
//         const data = await wechatApi.fetchAccessToken();
//         const access_token = data.access_token;

//         const tickeData = await wechatApi.fetchTicket(access_token);
//         const ticket = tickeData.ticket;
//         const url = ctx.href;

//         const param = sign(ticket, url);
//         ctx.body = ejs.render(tpl, param);
//         return next;
//     }
//     await next();
// })
// app.use(wechat(config.wechat, weixin.reply));
router.get('/movie', async (ctx, next) => {
    await ctx.render('./index.hbs', {
        timestamp: 1,
        nonceStr: 'test',
        signature: 'test'
    });
});

app.use(router.routes());
// app.use(async (ctx, next) => {
    
// })
app.on('error', (err, ctx) => {
    logger('server error', err, ctx);
})
app.listen(1314);