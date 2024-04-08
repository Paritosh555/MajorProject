const mongoose = require('mongoose');
const Review = require('./review');
const User = require("./user")
const Schema = mongoose.Schema;

const Listingschema = Schema({

    title : {
                type:String,
                required:true
            },
    
    description: {

            type:String
    },
    image:{    
        
            url:String,
            filename:String,
         },

    price:Number,
    location:String,
    country: String,
    reviews:[

        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
       
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

Listingschema.post("findOneAndDelete", async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})     //daout
};
});

const Listing = mongoose.model("Listing",Listingschema);
module.exports = Listing;