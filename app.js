const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const session=require("express-session");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

const sessionOptions={
    secret:"this is a secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() +1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }

}


const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";


app.use(session(sessionOptions));
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




app.use("/listings" , listings);
app.use("/listings/:id/reviews",reviews);




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

app.listen(3000,()=>{
    console.log("server is running");
})



async function main(){
    await mongoose.connect(MONGO_URL);
}