const Listing = require("../models/listing.js");//--------------mongodb schema file-------------------------
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;                                
const geocodingClient = mbxGeocoding({accessToken:mapToken});  





module.exports.index = async(req,res,next)=>{

    let alldata = await Listing.find();
    res.render("listings/index.ejs",{alldata});
};

module.exports.showRoute = async(req,res,next)=>{
  
    let {id} = req.params;
    let idData= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!idData)  
    {
       req.flash("error","Listing Does not exist !");
      return res.redirect("/listings");
    }
    
   
   res.render("listings/show.ejs",{idData});
};

//----------------------------------------------------------------------------------------------------------
module.exports.createRoute = async(req,res,next)=>{
  
    
    let{ title,description,price,location,country} = req.body;

    let response = await geocodingClient.forwardGeocode({
      query: location,
      limit: 1
    })
      .send()
      
    let geometry = response.body.features[0].geometry; 

    
    let url = req.file.path;
    let filename = req.file.filename;
   
     const user1 = new Listing({

           title:title,
           description:description,
           image:{
            url,filename
           },
           price:price,
           location:location,
           country:country,
           geometry:geometry

          });

         user1.owner = req.user._id; 
         await user1.save();
         req.flash("success","New Listing Created !");
         res.redirect("/listings");
};

module.exports.editRoute = async(req,res,next)=>{
  
    let{id} = req.params;
    const idData = await Listing.findById(id);
    let originalImg = idData.image.url;
    originalImg = originalImg.replace("/upload","/upload/h_300,w_250");
  if(!idData)
  {
    req.flash("error","Listing Does not exist !");
    return  res.redirect("/listings");
  };


    res.render("listings/edit.ejs",{idData,originalImg});

}


module.exports.updateRoute = async(req,res,next)=>{
   
    let{id} = req.params;
    let{ title,description,price,location,country} = req.body; 
    await Listing.updateOne({_id:id},{price:price,title:title,description,location:location,country:country});
   
    if(typeof req.file !== "undefined") 
    {                                    
         let url = req.file.path;
         let filename = req.file.filename
         await Listing.updateOne({_id:id},{price:price,title:title,image:{
          url:url,
          filename:filename
         },description:description,location:location,country:country});
        
    }
    res.redirect(`/listings/${id}`);
  };


 module.exports.deleteRoute = async(req,res,next)=>{
  
    let{id} = req.params;
    
    await Listing.deleteOne({_id:id});
    req.flash("success","Listing Deleted !")
    res.redirect("/listings");
};