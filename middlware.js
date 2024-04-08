const { equal } = require("joi");
const Listing = require("./models/listing");
const wrapasync = require("./utils/wrapasync");



module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        
        req.session.redirectUrl = req.originalUrl; // jevha user ni loged in kel nasel tevha apn loged in karnar tevha jya route madhe apn 
        // apan ha middlware defined kelay tyaza url save karte
       // console.log(req.session.redirectUrl);
        req.flash("error","you must be logged in to create listings !");  
        return res.redirect("/login")
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
        // ha middleware bagto ki loged in kelyvr jith varcha loged in middleware set kelay tithun jya page sathi loged in condition thevliy tyach page vr redirect hone
    if(req.session.redirectUrl) // jr yamadhe url save asel tr to locals madhe store hoil karn apn local kuthe pn access karu shakto ani save kelel   apn loged in route banvlay tith redirect karne                          
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapasync(async(req,res,next)=>{  // ha middleware check karto ki nkki loged in kelala user ani edit kartoy tya listing cha owner cha id jr same nasel tr edit karta yenar nahi
                                                                    // backend sathi use
            let {id} = req.params;
            let listing =  await Listing.findById(id);
            if(!listing.owner._id.equals(res.locals.currentUser._id))
            {
                req.flash("error","You are not the owner of this listing !");
                return res.redirect(`/listings/${id}`);
            }
            next();
            
});