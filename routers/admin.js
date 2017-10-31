'use strict';

const index = require('../controllers/admin/index');
const list = require('../controllers/admin/list');
const edit = require('../controllers/admin/edit');
const add = require('../controllers/admin/add');
const detail = require('../controllers/admin/detail');
const Router = require('koa-router');
const router = new Router();

index(router);
list(router);
edit(router);
add(router);
detail(router);

module.exports = router;