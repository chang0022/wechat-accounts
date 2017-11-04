'use strict';
const Movie = require('../../models/movie');

const getDetail = async (ctx, next) => {
    let id = ctx.params.id;
    let movie = await Movie.findById(id);
    await ctx.render('./admin/detail.hbs', {
        movie: movie[0]
    });
};

module.exports = router => {
    router.get('/detail/:id', getDetail);
};