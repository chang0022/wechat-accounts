'use strict';

const movie = require('../controllers/movie');
const wechat = require('../controllers/wechat');
const Router = require('koa-router');
const router = new Router();

movie(router);
wechat(router);

module.exports = router;