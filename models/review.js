const mongoose =  require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating :{
        type:Number,
        min:1,
        max:5,
    },  
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"  //here the user id is passed ,,it can access more info by populate()
    }
});


module.exports = mongoose.model("review",reviewSchema);