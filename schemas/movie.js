const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: String,
    doctor: String,
    country: String,
    language: String,
    poster: String,
    source: String,
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
});

MovieSchema.statics = {
    fetch: async function () {
        return await this
            .find({})
            .sort('meta.updateAt')
            .exec();
    },
    findById: async function (id) {
        return await this
            .findOne({ _id: id })
            .exec();
    }
};

module.exports = MovieSchema;