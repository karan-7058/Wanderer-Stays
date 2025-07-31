const JOI = require("joi");

const listingSchema = JOI.object({
    listing: JOI.object({
        title: JOI.string().required(),
        description: JOI.string().required(),
        location: JOI.string().required(),
        price: JOI.number().required().min(0),
        country: JOI.string().required(),
        image: JOI.string().allow(null, "")
    }).required()
});

const reviewSchema = JOI.object({
    review: JOI.object({
        rating: JOI.number().required().min(1).max(5),
        comment: JOI.string().required()
    }).required()
});

module.exports = { listingSchema, reviewSchema };
