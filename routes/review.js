const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");//--------------mongodb schema file-------------------------
const wrapAsync = require("../utils/wrapasync.js");
const{listingSchema,reviewSchema} = require("../schema.js");//--------------------Listing schema file require
const ExpressError = require("../utils/ExpressClass.js");//----------utils expressClass require
const Review = require("../models/review.js");//------------------------review schema file require
const{isLoggedin} = require("../middlware.js");
const reviewController = require("../controller/reviews.js")//---------------review file in controller


let validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
  
     throw new ExpressError(400,error);
    }
    else{
  
      next();
    }
  }



 // create review route--------------------------------------------------------------------------------------------------------

router.post("/",isLoggedin,wrapAsync(reviewController.crateReview));

// delete review route--------------------------------------------------------------------------------------------------------


router.delete("/:reviewId",isLoggedin,wrapAsync(reviewController.deleteRoute));


module.exports = router





 