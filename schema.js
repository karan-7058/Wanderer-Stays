const JOI=require("joi");

module.exports= listingSchema=JOI.object({
    listing:JOI.object({
         title:JOI.string().required(),
         description:JOI.string().required(),
         location:JOI.string().required(),
         price:JOI.number().required().min(0),
         country:JOI.string().required(),
         image:JOI.string().allow(null, "")
    }).required()
         
});
     

module.exports.reviewSchema=JOI.object({
    review:JOI.object({
        rating:JOI.number().required().min(1).max(5),
        comment:JOI.string().required()
    }).required()
});
