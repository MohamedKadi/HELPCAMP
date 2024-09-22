const Joi = require('joi');
//export an obj
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
        .regex(/^[a-zA-Z]+$/)
        .min(3)
        .max(30)
        .required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
})