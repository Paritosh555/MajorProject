const Review = require("../models/review.js");//------------------------review schema file require
const Listing = require("../models/listing.js");//--------------mongodb schema file-------------------------

module.exports.crateReview  = async(req,res,next)=>{

    let {id} = req.params;
    
    let listInfo = await Listing.findById(id);
    let {Rating,Comment} = req.body;
 
    let newReview = new Review({
     comment:Comment,
     rating:Rating,
 
    });
 
    newReview.author = req.user._id;
    listInfo.reviews.push(newReview);
    await newReview.save();
    await listInfo.save();
    req.flash("success","Review Added Successfully !");
    res.redirect(`/listings/${id}`);
 
 };


 module.exports.deleteRoute = async(req,res,next)=>{

    let{id,reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});  // yane aplya listings madhe particular listig  cha ha id ahe tya 
    // listingchya revieviews madhun ha reviewId romeve karte mahnje cienta side varun te jail review
    await Review.findByIdAndDelete(reviewId);  // ha direct  rivew chya data base madhu remove karel
    res.redirect(`/listings/${id}`);
  
  };