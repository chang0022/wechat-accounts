'use strict';

const movie = require('../controllers/movie');
const Router = require('koa-router');
const router = new Router();

movie(router);

module.exports = router;