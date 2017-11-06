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

const deleteMovie = async (ctx, next) => {
    let id = ctx.params.id;
    await Movie.deleteById(id);
    ctx.body = {
        "code": 200,
        "msg": "OK"
    }
};

module.exports = router => {
    router.get('/api/movie/list', getMovieList);
    router.delete('/api/movie/:id', deleteMovie);
};