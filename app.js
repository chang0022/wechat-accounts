'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const logger = require('koa-logger');
const serve = require('koa-static');

const admin = require('./routers/admin');
const wechat = require('./routers/wechat');

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(views(__dirname + '/views', {
    map: {
        hbs: 'handlebars'
    }
}));
app.use(serve('./static'));

router.use('/admin', admin.routes());
router.use('/wechat', wechat.routes());


app.use(router.routes());


app.on('error', (err, ctx) => {
    logger('server error', err, ctx);
});
app.listen(1314);