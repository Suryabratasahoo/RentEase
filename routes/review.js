const express=require("express");
const router=express.Router({mergeParams:true});
// requiring review model
const Review=require("../models/Review.js");
// requiring the wrapAsync function
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js");
// requring listing schema
const Listing = require("../models/listing.js")
// requiring isLoggedIn
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");



const reviewController=require("../controllers/reviews.js");

// Reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destoryReview));


module.exports=router;