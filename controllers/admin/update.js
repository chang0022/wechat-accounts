'use strict';
const Movie = require('../../models/movie');

const updateList = async (ctx, next) => {
    let id = ctx.params.id;
    if(!!id) {
        let movie = await Movie.findById(id);
        await res.render('./admin/edit.hbs', {
            movie: movie
        });
    }
    await ctx.render('./admin/edit.hbs');
};

module.exports = router => {
    router.get('/update/:id', updateList);
};