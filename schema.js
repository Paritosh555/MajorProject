const Joi = require('joi');
const { models } = require('mongoose');
module.exports.listingSchema = Joi.object({

    listing : Joi.object({
        title : Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.string().required().min(0),
        country:Joi.string().required()

    }).required(),
});


module.exports.reviewSchema = Joi.object({

    Review : Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required().min(1).max(5),

    }).required(),
});

