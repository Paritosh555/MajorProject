const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const User = require("../models/user.js");//--------------------------User model require
const passport = require("passport");//--------------------------passport package require
const{saveRedirectUrl} = require("../middlware.js");
const usersController = require("../controller/user.js");//--------------controller user file require

//-----------------------------------------signUp route-------------------------------------------------------------------------


router.get("/signup",async(req,res)=>{

   res.render("users/signup.ejs");
})

//-------------------------------------------------------------------------------------------------------------------------

router.post("/signup",wrapAsync(usersController.signup));

//----------------------------------------Login route-----------------------------------------------------------------------

router.get("/login",async(req,res)=>{

    res.render("users/login.ejs");
 });

//----------------------------------------------------------------------------------------------------------------------------

 router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), usersController.login);
 

//-------------------------------------------Logout route---------------------------------------------------------------------


router.get("/logout",usersController.logout);

//-----------------------------------------------------------------------------------------------------------------------------
module.exports = router;