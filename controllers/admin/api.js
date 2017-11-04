'use strict';
const Movie = require('../../models/movie');

const getMovieList = async (ctx, next) => {
    let movies = await Movie.fetch();
    ctx.body = {
        "code": 0,
        "msg": "OK",
        "count": movies.length,
        "data": movies
    }
};

module.exports = router => {
    router.get('/api/movie/list', getMovieList);
};