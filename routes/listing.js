const express=require("express");
const router=express.Router();
// requiring wrap async file
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });







// requiring the listing controller which have all the callbacks regarding the routes
const listingController=require("../controllers/listings.js");
const listing = require("../models/listing.js");

// /listings for the listing page



// index route and create route combined
// restructuring similar routes using router.route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// combining show, update and delete route 
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));





module.exports=router;