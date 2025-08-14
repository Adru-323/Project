const express = require("express");
const router = express.Router({mergeParams:true});       //use to :id value to the child as its modified by remove the commann 
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewControler = require("../controllers/reviews.js")


//reviews //post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControler.createReview));


//Delete review
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,reviewControler.destroyReview);


module.exports=router;



