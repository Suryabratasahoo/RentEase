// requiring .env file
require('dotenv').config();




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// requiring custom express error class
const expressError=require("./utils/expressError.js");
// requiring express session
const session=require("express-session");
const mongoStore=require("connect-mongo")
// requiring connect-flash
const flash=require("connect-flash");
// requiring passport
const passport=require("passport");
// requiring localStrategy
const LocalStrategy=require("passport-local");
// requiring usermodel
const User=require("./models/user.js");
// requiring multer
const multer=require("multer");
const upload = multer({ dest: 'uploads/' })
const dbUrl=process.env.ATLASDB_URL;
const secret=process.env.SECRET;

// requring the listing.js file which has all routes regarding the listings
const listingRouter=require("./routes/listing.js");



// requring the review.js file which has all routes regarding the review
const reviewRouter=require("./routes/review.js");

// requiring the user.js file which has all routers reagarding the user
const userRouter=require("./routes/user.js");
const MongoStore = require('connect-mongo');










// connecting to database
// ------------------------------------------------------------------------
main().then(() => {
    console.log("connected to database")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
// -------------------------------------------------------------------------
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:secret
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})
// defining the session
const sessionOptions={
    store:store,
    secret:secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


app.use(session(sessionOptions));
app.use(flash());
// flash should be used before routes

// starting with passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found"));
})
// define a middleware for handling error
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
})

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
