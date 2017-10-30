'use strict';

const getIndex = async (ctx, next) => {
    await ctx.render('./admin/index.hbs');
};

module.exports = router => {
    router.get('/', getIndex);
};