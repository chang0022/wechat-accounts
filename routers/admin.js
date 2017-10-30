'use strict';

const index = require('../controllers/admin/index');
const Router = require('koa-router');
const router = new Router();

index(router);

module.exports = router;