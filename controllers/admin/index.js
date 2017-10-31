'use strict';
const Movie = require('../../models/movie');

const getIndex = async (ctx, next) => {
    
    var movies = await Movie.fetch();
    
    await ctx.render('./admin/index.hbs', {
        movies: movies
    }); 
};

module.exports = router => {
    router.get('/', getIndex);
};