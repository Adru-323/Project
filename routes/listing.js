const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validateListing} = require("../middleware.js");  //is owner validate the owner of list 
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const{storage} = require("../cloudConfig.js")
const upload = multer({ storage }) //this means the multer will create a folder where it will automaticly save the img



router.route("/")  //index,create route merge
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync( listingController.createListings));

//New route
//NEW listings                             
router.get("/new",isLoggedIn,listingController.renderNewForm);


//search route
router.get("/search", wrapAsync(listingController.search));



router.route("/:id") //show ,update, delete 
.get(wrapAsync( listingController.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destoryListings));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));

module.exports = router;