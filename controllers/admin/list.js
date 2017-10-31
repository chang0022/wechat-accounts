'use strict';

const getList = async (ctx, next) => {
    await ctx.render('./admin/list.hbs');
};

module.exports = router => {
    router.get('/list', getList);
};