const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const { reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");

//this is a middleware to validate the request body for creating or updating a review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


//this route is for posting a review to the specific listing
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    const review=new Review(req.body.review);
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    
    res.redirect(`/listings/${id}`);

}))

//this route is for deleting a review from the specific listing
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


module.exports=router;
