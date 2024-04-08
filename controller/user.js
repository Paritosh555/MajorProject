const User = require("../models/user.js");//--------------------------User model require


module.exports.signup = async(req,res)=>{
    try{
    let{username,email,password}= req.body;
    let user = new  User({
        username:username,
        email:email,
        password:password
    });

   const registerUSer = await User.register(user,password);
   req.login(registerUSer,(err)=>{      // yach arth asa hoto ki sigup kelyavr login krnyachi garj nahi login method direct check karte current user mahnje req.user madhe atumatically user ch object add hot
    if(err){

        next(err);
    }

    req.flash("success","Welcome to wanderLust");
    res.redirect("/listings");
});
}catch(err){

    req.flash("error","user was alredy exits !");
    res.redirect("/signup");
}
   
};


module.exports.login = async(req,res)=>{

                
    req.flash("success","you are logined !");
    if(res.locals.redirectUrl) // ya url madhe url tevha store hoil jvha user ni loged in nasel kel tevha
     {
        return res.redirect(res.locals.redirectUrl);  // he condition check krel ki res.locals.redirectUrl madhe url store ahe ka jr asel tr direct tya url vr redirect karel ani nasel tr direct listings  
     }

     res.redirect("/listings");
}

module.exports.logout = async(req,res)=>{

    req.logout((err)=>{

        if(err){

            next(err);
        }

        req.flash("success","You are logout");
        res.redirect("/listings");
    });
}