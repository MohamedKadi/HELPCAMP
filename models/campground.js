const mongoose = require('mongoose');
const Joi = require('joi');
const { campgroundSchema } = require('../validateSchemas');
const review = require('./review');


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
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    } 
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);