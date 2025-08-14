const listing = require("./models/listing.js"); 
const review = require("./models/review.js");
const {listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./Utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
        if(!req.isAuthenticated()){
            //storing OG url iin session //but after logion passport reset the session 
            // hence it deletes the OGurl hence store in locals
            // console.log(req.originalUrl);
            req.session.redirectUrl = req.originalUrl;

        req.flash("error","You must be lopgged in to create listing");
        return res.redirect("/login");
    }next()
};


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){  //if OG url present then store in local
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
     const { id } = req.params;
    let List= await listing.findById(id);
    //  console.log(List.owner._id);
    //  console.log(res.locals.currUser._id);
    if(!List.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listings")
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {//creatinng listing valid.ation //like wrapAsync
    let {error} = listingSchema.validate(req.body);
        //  console.log(error);          
    if(error){          //detail is an array  which contain {message,path(array),type,context(array)}
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};


module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
        //  console.log(error);          
    if(error){        
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    let Review= await review.findById(reviewId);
    console.log(Review);
    
    if(!Review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author  of the Review")
        return res.redirect(`/listings/${id}`);
    }
    next();
};