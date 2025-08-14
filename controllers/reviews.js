const review = require("../models/review.js");
const listing = require("../models/listing.js");

module.exports.createReview = async(req,res) => {
    let listings = await listing.findById(req.params.id);     //this is used to store the review in the specific listong
    let newReview = new review(req.body.review);             //review k undr save kiya jo review lekha tha as nsame provide
     newReview.author = req.user._id;
    listings.reviews.push(newReview);                         //yaha humne listiings k reviews mai store kara 
    console.log(newReview);
    
    await newReview.save();
    await listings.save();
    console.log("new review saved");
    req.flash("success","New review created!");
    res.redirect("/listings");
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //jo bhi listing mai revives mai reviewID match karega usse pull /delete
  await review.findByIdAndDelete(reviewId);
   req.flash("success","Review deleted!");
  res.redirect(`/listings/${id}`);
};