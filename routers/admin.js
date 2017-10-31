'use strict';

const index = require('../controllers/admin/index');
const list = require('../controllers/admin/list');
const edit = require('../controllers/admin/edit');
const Router = require('koa-router');
const router = new Router();

index(router);
list(router);
edit(router);

module.exports = router;