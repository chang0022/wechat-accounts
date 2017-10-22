'use strict';

const getMovie = async (ctx, next) => {
    await ctx.render('./index.hbs', {
        timestamp: 1,
        nonceStr: 'test',
        signature: 'test'
    });
};

module.exports = router => {
    router.get('movie', getMovie);
};