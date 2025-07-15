const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");




const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";

app.listen(3000,()=>{
    console.log("server is running");
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);


//this is root route for make sure the server is running...
app.get("/",(req,res)=>{
    res.send("server is started");
})

//this is a middleware to validate the request body for creating or updating  a listing
const validateListing=(req,res,next)=>{
 
    let {error} =listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

//this is a middleware to validate the request body for creating or updating a review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

//this route is for showing all the listings
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listing/index.ejs",{allListings});
}));


//this route is for creating a new listing
//this route is for showing the form to create a new listing
app.get("/listings/new", (req,res)=>{
    res.render("./listing/new.ejs");
})

//this route  is for showing a specific listing in details
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    const {id}=req.params;
   const listing= await Listing.findById(id).populate("reviews");
   res.render("./listing/show.ejs",{listing});

}));


//this route is for posting a new listing after filling the form    
app.post("/listings",validateListing, wrapAsync(async (req,res , next)=>{

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
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
}));

//this route is for updating a listing after filling the form
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
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
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//this route is for posting a review to the specific listing
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    const review=new Review(req.body.review);
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    
    res.redirect(`/listings/${id}`);

}))

//this route is for deleting a review from the specific listing
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

// app.get("/testlisting", (req,res)=>{
//     const listing=new Listing({
//         title:"new villa",
//         description:"this is 3 bhk villa",
//         location:"goa",
//         price:10000,
//         country:"india",
//  });

//    listing.save();
//    res.send("listing created");
//    console.log(listing);

    
// });




//this is a catch all route for handling 404 errors
//it should be placed after all the other routes 
app.all('*', (req, res , next)=>{
   next(new ExpressError(404 , "page not found"));

});


//this is the error handling middeware
//it should be the last middleware in the stack
app.use((err , req , res , next)=>{
   let {status=500  , message="something went wrong"}=err;
   res.status(status).render("./listing/error.ejs",{message});

});

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect(MONGO_URL);
}