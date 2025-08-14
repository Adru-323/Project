//CONTROLER
const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //required the services // loc to cordinate
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //start the service by giving access 



module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =(req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res) => {
    let{id}=req.params;
    const list = await listing.findById(id).populate({
        path:"reviews",populate:{path:"author"}
    }).populate("owner");
    if(!list){
        req.flash("error","listing you requested for does not exist!");
       return  res.redirect("/listings");
    }    
    res.render("listings/show.ejs",{list});
};

module.exports.createListings = async(req,res) => {
let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
    let url = req.file.path;   //upload hone k baad cloud req.file as a res send krta h
    let filename = req.file.filename;
    let Newlisting=new listing( req.body.listing)  //since inner portion returns a obejct it can save directly
    Newlisting.owner = req.user._id;
    Newlisting.image = {url,filename};

    Newlisting.geometry = response.body.features[0].geometry;
    console.log(response.body.features[0].geometry.coordinates);
    
    let saveListing =    await Newlisting.save();
    // console.log(saveListing);
    
   req.flash("success","New listing Added sucessfully!");  //jise hi post ho thn ye pop aye
   res.redirect("/listings")      
};


module.exports.renderEditForm = async (req,res) => {
    let{id} = req.params;
    const list = await listing.findById(id);    
    if(!list){
        req.flash("error","listing you requested for does not exist!");
       return  res.redirect("/listings");
    }
    let orignalimage = list.image.url;    
    let orignalImageUrl = orignalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{list,orignalImageUrl})
};


module.exports.updateListings = async(req,res) => {
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;   
    let filename = req.file.filename;
    Listing.image = {url,filename};
    await Listing.save();
    }
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
};


// module.exports.updateListings = async (req, res) => {
//     const { id } = req.params;
//     const data = req.body.listing;

//     const updatedData = {
//         title: data.title,
//         description: data.description,
//         price: data.price,
//         location: data.location,
//         country: data.country,
//         image: {
//             url: data.image,
//             filename: data.image?.filename || ""
//         }
//     };
//     await listing.findByIdAndUpdate(id, updatedData);
//     req.flash("success","listing updated!");
//     res.redirect(`/listings/${id}`);
// };

module.exports.destoryListings = async(req,res) => {
    let {id} = req.params;
    let deleteLIsting = await listing.findByIdAndDelete(id);
    console.log(deleteLIsting);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};

module.exports.search = async (req, res) => {
    const searchTerm = req.query.query;
    if (!searchTerm) {
        return res.redirect("/listings");
    }
 const listings = await listing.find({
    location: { $regex: searchTerm, $options: "i" } // case-insensitive match
  });
    res.render("search.ejs", { listings, searchTerm });
};