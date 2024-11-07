const User=require("../models/user");

// signUp form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
// signUp backend
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup')
    }
    
        
}
// login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};
// backend login
module.exports.logIn=async(req,res)=>{
    req.flash("success","welcome to Wanderlust! you are logged in ")
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
    
};

// backend Logout
module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    })
    req.flash("success","you are logged out");
    res.redirect("/listings");
};