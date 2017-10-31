'use strict';

const addMovie = async (ctx, next) => {
    const movie = ctx.request.body;
    console.log(movie)
    // await ctx.render('./admin/edit.hbs');
};

module.exports = router => {
    router.post('/add/movie', addMovie);
};