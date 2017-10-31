'use strict';

const getEdit = async (ctx, next) => {
    await ctx.render('./admin/edit.hbs');
};

module.exports = router => {
    router.get('/edit', getEdit);
};