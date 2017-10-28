'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const logger = require('koa-logger');

const api = require('./routers/api');

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(views(__dirname + '/views', {
    map: {
        hbs: 'handlebars'
    }
}));

router.use('/', api.routes());

app.use(router.routes());


app.on('error', (err, ctx) => {
    logger('server error', err, ctx);
});
app.listen(1314);