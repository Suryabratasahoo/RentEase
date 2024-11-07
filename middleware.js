const Listing=require("./models/listing.js");
// requiring joi listingSchema and review schema
const {listingSchema}=require("./schema.js");
// requiring custom express error class
const expressError=require("./utils/expressError.js");
// requiring joi listingSchema and review schema
const {reviewSchema}=require("./schema.js");
const Review=require("./models/Review.js")


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // information of redirect url will be saved if the user is not logged in
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new expressError(400,errMsg);
    }else{
        next();
    }
    
}

// function to validate review schema in server side
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.currUser && review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You didn't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}