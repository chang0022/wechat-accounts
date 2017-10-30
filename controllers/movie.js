'use strict';

const Wechat = require('../libs/wechat/index');
const config = require('../config/wx.config');
const wechatApi = new Wechat(config.wechat);
const sign = require('../libs/sign');



const getMovie = async (ctx, next) => {
    const data =  await wechatApi.fetchAccessToken();
    const access_token = data.access_token;
    const tickeData = await wechatApi.fetchTicket(access_token);
    const ticket = tickeData.ticket;
    const url = ctx.href;

    const param = sign(ticket, url);

    await ctx.render('./wechat/index.hbs', param);
};

module.exports = router => {
    router.get('/movie', getMovie);
};