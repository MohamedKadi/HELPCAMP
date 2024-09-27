const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
});

module.exports = mongoose.model('Review', reviewSchema);