'use strict'

const Koa = require('koa');

const wechat = require('./wechat/middleware');
const path = require('path');
const util = require('./libs/utils');
const config = require('./config')
const weixin = require('./weixin');

const app = new Koa();

app.use(wechat(config.wechat, weixin.reply));

app.listen(1314);