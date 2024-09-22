const mongoose = require('mongoose');
const Joi = require('joi');


const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        min: 0,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
});

module.exports = mongoose.model('Campground', CampgroundSchema);