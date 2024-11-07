const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
// exporting redirectUrl
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

// signin
// combining signup get and post request
router.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUp));
// sign in ends


// login starts
// .combining login get and post request
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.logIn);
// login ends here

// logoutstarts
router.get("/logout",userController.logOut);

module.exports=router;

