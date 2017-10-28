'use strict';

const wechat = require('../middleware/wechat');
const reply = require('../libs/wechat/reply');

const getWechat = async (ctx, next) => {
    ctx.app.use(wechat(reply));
    await next();
};

module.exports = router => {
    router.all('wx', getWechat);
};