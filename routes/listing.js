const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const{listingSchema,reviewSchema} = require("../schema.js");//--------------------Listing schema file require
const ExpressError = require("../utils/ExpressClass.js");//----------utils expressClass require
const Listing = require("../models/listing.js");//--------------mongodb schema file-------------------------
const {isLoggedin,isOwner} = require("../middlware.js");
const listingController = require("../controller/listings.js");//        controller listings file require
const multer  = require('multer');//------------------------multerr form
const {storage} = require("../cloudConfig.js");//---------------configuration file require
const upload = multer({storage});//-------------------------multer

  //------------------------------------------------------------------------------------------------------------------------------
router.get("/",wrapAsync(listingController.index));
  
  //-------------------------------------------------new route-----------------------------------------------------------------------
  
     router.get("/new",isLoggedin,(req,res)=>{  
             res.render("listings/new.ejs");
         });
  
  
  //-------------------------------------------------show route-----------------------------------------------------------------------
  
  
  
        router.get("/:id",wrapAsync(listingController.showRoute));
  
  //------------------------------------------------create Route----------------------------------------------------------------
  
  router.post("/",isLoggedin,upload.single("image"),wrapAsync(listingController.createRoute)); 
  //------------------------------------------------Edit Route ---------------------------------------------------------------
  
  router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editRoute));
  
  //------------------------------------------------ Update Route----------------------------------------------------------------
  
  router.put("/:id",isOwner,upload.single("image"),wrapAsync(listingController.updateRoute));
  
  //------------------------------------------------ DELETE  Route----------------------------------------------------------------
  
  
  router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteRoute));


  module.exports = router;