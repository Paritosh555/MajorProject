
if(process.env.NODE_ENV != "production"){
      require('dotenv').config() ;           // env file madhe enviromental variables access krnyasathi        
}
//console.log(process.env.SECRETE);  // env file madhe enviromental variables access krnyasathi

//----------------------------------------------------------------------------------------------------------------------------
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const Listing = require("./models/listing.js");//--------------mongodb schema file-------------------------
const { name } = require("ejs");//----------------ejs --------
app.set("view engine","ejs"); //--------------------
const ejsMate = require('ejs-mate');//---------------------------ejsMate multimule templetes of ejs use
app.engine('ejs', ejsMate);//-------------------------------ejs mate
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//-------post,patch,put method complsary lihane
var methodOverride = require('method-override');// method overide----------------
app.use(methodOverride('_method'));//-------------------
app.use(express.static(path.join(__dirname,"public")));  //--------------public folder access
const wrapAsync = require("./utils/wrapasync.js");//--------Utils wrapasync function require
const ExpressError = require("./utils/ExpressClass.js");//----------utils expressClass require
const{listingSchema,reviewSchema} = require("./schema.js");//--------------------Listing schema file require
const Review = require("./models/review.js");//------------------------review schema file require
const session = require("express-session"); //-----------------session pakage require
const MongoStore = require('connect-mongo'); // yachyasathi pn express session lagete
const flash = require("connect-flash");//-----------------------flash require

const passport = require("passport");//--------------------------passport package require   // passport sathi 3 pakege astat tyatli 2 hite ani signup schama pashi
const LocalStrategy = require("passport-local");//----------------passport package2 require
const User = require("./models/user.js");//--------------------------User model require

//------------------------------------------------------------Database Connection----------------------------------------------

const listings = require("./routes/listing.js");//--------------------router listings file require

const reviews  = require("./routes/review.js");//---------------------router review file require

const users = require("./routes/user.js");//---------------------------router user file require

//--------------------------------------------------------Original Mongodb connection------------------------------------------------------------------------

// try{ 
//     main()
//     .then(()=>{
//     console.log("connection successfully");
//      });
// }
// catch(err)
// {
//      console.log(err)
// };

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

// };

//--------------------------------------------------------------Project Deployment Mongodb conection---------------------------------------------------------------

const dbUrl = process.env.ATLASDB_URL;
try{
  main()
  .then(()=>{
  console.log("connection successfully");
   });
}
catch(err)
{
   console.log(err)
};

async function main() {
await mongoose.connect(dbUrl);

};

// mongo store option-----------------------------------------------------------he apla database internet ver pathvnyasathi use-- he direct session madhe pn lihu shakto 
// pn direct variable defind karun lihne tyat option lihne ani seession madhe store karne last step project zalya nunter karne

const store =  MongoStore.create({
    mongoUrl:dbUrl, // jo apn databse mongoatlas vr pathvnyasathi definde kelay to
    crypto:{

      secret:process.env.SECRET,   // ya madhe direct value pass keli tri cahlel kiva env madhe store karun direct varible decleare
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{

    console.log("error in mongo session store",err);
});
//---------------------------------------------Session Options-----------------------------------------------------------------

const sessionOptions = {
  store,
  secret:process.env.SECRET, 
  resave:false,
  saveUninitialized:true,
  cookie:{

    expires:Date.now()+7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000
  },

  httpOnly:true,
};

//------------------------------------------------flash and session middleware-----------------------------------------
app.use(session(sessionOptions));// passport configuration nehami yachya khli lihane
app.use(flash());

//---------------------------------------------passport configuration-----------------------------------------

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));     // signup and login automatically

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


// app.get("/demoUser",async(req,res)=>{

//       let user1  = new User({

//           email:"paritosh@gmail.com",
//           username:"paritosh",
//       });

//      let us = await User.register(user1,"paritosh");
//      console.log(us);
// })

//-------------------------------------------------------------Flash-Massege midleware--------------------------------------

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");                                                 // ha middleware nehmi session and flash declerationchya khali pahije
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


//---------------------------review error handler------------------------------------------------------------------------

let validateReview = (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){

   throw new ExpressError(400,error);
  }
  else{

    next();
  }
}

//-----------------------------------------join listings route in routes folder----------------------------------------------------------------
app.use("/listings", listings); // saglyat comman ky ahe te kadhaych

//----------------------------------------join review route in routes folder---------------------------------------------------

app.use("/listings/:id/reviews",reviews);

//----------------------------------------join review route in routes folder---------------------------------------------------

app.use("/",users);

//-------------------------------------------------------------------------------------------------------------------------

  app.post("/search",async(req,res)=>{

        let {country} = req.body;
        let search = await Listing.find({country:country});
        res.render("listings/search.ejs",{search});
  });
//------------------------------------Incorrect local host error handel middleware------------------------------------------

app.all("*",(req,res,next)=>{

  next(new ExpressError(404,"Page Not Found !"));
})

//------------------------------------Error Handler Middleware---------------------------------------------------------------


app.use((err, req, res, next)=>{

  let{ status=500,message="status error"} = err;
  res.render("listings/error.ejs",{message});
})

//----------------------------------------------------------------------------------------------------------------------------
app.listen(port,()=>{

    console.log(`Server start on port ${port}`);
});






























//-------------------------------------------------------------------------------------------------------------------------------

