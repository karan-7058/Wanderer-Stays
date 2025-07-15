const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        
    },

    image:{
        type:{
            filename:String,
            url:String
        },
        
        
    },
    location:{
        type:String,
       
    },
    price:{
        type:Number,
       
    },
    country:{
        type:String,
        
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]

});

listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;

