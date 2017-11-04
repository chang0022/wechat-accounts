'use strict';
const Movie = require('../../models/movie');

const addMovie = async (ctx, next) => {
    let movie = ctx.request.body;
    let id = movie.id;
    let _movie = null;

    if (!!id) {
        _movie = await Movie.findById(id);
        Object.assign(_movie, movie);
        _movie.save();
        await ctx.redirect('/detail/' + _movie.id)
    } else {
        _movie = new Movie({
            name: movie.name,
            doctor: movie.doctor,
            country: movie.country,
            language: movie.language,
            poster: movie.poster,
            source: movie.source,
            year: movie.year,
            summary: movie.summary
        })
        _movie.save()
        await ctx.redirect('/detail/' + _movie.id)
    }
};

module.exports = router => {
    router.post('/add/movie', addMovie);
};