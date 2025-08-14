const mongoose =  require("mongoose");
const review = require("./review");
const { types, string } = require("joi");
const Schema = mongoose.Schema;


let listingSchema = new Schema({            //Schema
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
// Corrected code for your listing.js file
image: {
    filename: {
        type: String
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
    },
},
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{   //standard formate of geojion to perform different funtionalities 
      type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },
    category:{
        type : String,
        enum:["mountains","artic","pool","farms","trending"]
    }
});

//since we are deletinng the review after the listing is deleted so must require the review schema and model
//here the listing constains the data which is deleted whole 
listingSchema.post("findOneAndDelete", async(delListing) => {
    if(delListing){
     await review.deleteMany({ _id: { $in: delListing.reviews } });
    }
});

// agar listiing delete hue toh reviews bhi delete hojaye pure uss specific listing k 
//_id jo listing mai ki id se equal hai delete hojaye


const listing = mongoose.model("listing",listingSchema);            //collection 


module.exports= listing;