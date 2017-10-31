'use strict';

const getDetail = async (ctx, next) => {
    await ctx.render('./admin/detail.hbs');
};

module.exports = router => {
    router.get('/detail', getDetail);
};