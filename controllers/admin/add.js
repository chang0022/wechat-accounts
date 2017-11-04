'use strict';
const Movie = require('../../models/movie');

const addMovie = async (ctx, next) => {
    let movie = ctx.request.body;
    let id = movie.id;
    let _movie = null;

    if (!!id) {
        _movie = await Movie.fetchById(id);
        console.log(_movie)
        Object.assign(_movie, movie);
        await _movie.save()
            .then(movie => {
                ctx.redirect('/admin/detail/' + movie.id)
            })
            .catch(err => {
                console.log(err);
                ctx.redirect('back');
            });
    } else {
        _movie = new Movie({
            name: movie.name,
            doctor: movie.doctor,
            country: movie.country,
            language: movie.language,
            poster: movie.poster,
            year: movie.year,
            summary: movie.summary
        })
        await _movie.save()
            .then(movie => {
                console.log(movie)
                ctx.redirect('/admin/detail/' + movie.id)
            })
            .catch(err => {
                console.log(err);
                ctx.redirect('back');
            });
    }
};

module.exports = router => {
    router.post('/add/movie', addMovie);
};