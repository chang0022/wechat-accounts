'use strict';

const getIndex = async (ctx, next) => {
    await ctx.render('./admin/index.hbs', {
        movies: [
            {
                id: 1,
                poster: 'https://static.bootcss.com/www/assets/img/liquid.png?1508511738690',
                title:'Liquid - Jekyll 的模板语言。'
            },
            {
                id: 2,
                poster: 'https://static.bootcss.com/www/assets/img/codeguide.png?1508511738690',
                title:'Bootstrap 编码规范'
            },
            {
                id: 3,
                poster: 'https://static.bootcss.com/www/assets/img/yarn.png?1508511738690',
                title:'Yarn 中文文档'
            },
            {
                id: 4,
                poster: 'https://static.bootcss.com/www/assets/img/react.png?1508511738690',
                title:'React'
            },
            {
                id: 5,
                poster: 'https://static.bootcss.com/www/assets/img/webpack.png?1508511738690',
                title:'webpack'
            },
            {
                id: 6,
                poster: 'https://static.bootcss.com/www/assets/img/jqueryapi.png?1508511738690',
                title:'jQuery API'
            },
            {
                id: 7,
                poster: 'https://static.bootcss.com/www/assets/img/vuejs.png?1508511738690',
                title:'Vuejs'
            },
            {
                id: 8,
                poster: 'https://static.bootcss.com/www/assets/img/handlebars.png?1508511738690',
                title:'Handlebars 模板引擎'
            },
            {
                id: 9,
                poster: 'https://static.bootcss.com/www/assets/img/underscore.png?1508511738690',
                title:'Underscore.js'
            },
            {
                id: 10,
                poster: 'https://static.bootcss.com/www/assets/img/lesscss.png?1508511738690',
                title:'LESS 一种动态样式语言'
            }
        ]
    });
};

module.exports = router => {
    router.get('/', getIndex);
};