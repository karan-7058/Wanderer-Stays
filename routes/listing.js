const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");

//this is a middleware to validate the request body for creating or updating  a listing
const validateListing=(req,res,next)=>{
 
    let {error} =listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}


//this route is for showing all the listings
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listing/index.ejs",{allListings});
}));


//this route is for creating a new listing
//this route is for showing the form to create a new listing
router.get("/new", (req,res)=>{
    res.render("./listing/new.ejs");
})

//this route  is for showing a specific listing in details
router.get("/:id", wrapAsync(async (req,res)=>{
    const {id}=req.params;
   const listing= await Listing.findById(id).populate("reviews");
   res.render("./listing/show.ejs",{listing});

}));


//this route is for posting a new listing after filling the form    
router.post("/",validateListing, wrapAsync(async (req,res , next)=>{

    const {title,description,location,price,country , image}=req.body.listing;
     
    const listing=new Listing({
        image:{
            filename:"listingimage",
            url:image
        },
        title:title,
        description:description,
        location:location,
        price:price,
        country:country

    });
   
    await listing.save();
    res.redirect("/listings");
    

}));

//this route is for showing the form to edit a listing
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
}));

//this route is for updating a listing after filling the form
router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const{title,description,location,price,country}=req.body.listing;
    const listing= await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        location:location,
        price:price,
        country:country

    });
    res.redirect(`/listings/${id}`);

}));

//this route is for deleting a listing
router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports=router;