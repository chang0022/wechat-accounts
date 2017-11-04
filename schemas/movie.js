const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: String,
    doctor: String,
    country: String,
    language: String,
    poster: String,
    year: Number,
    summary: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

MovieSchema.statics = {
    fetch() {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec();
    },
    fetchById(id) {
        return this
            .findById(id)
            .exec();
    }
};

module.exports = MovieSchema;