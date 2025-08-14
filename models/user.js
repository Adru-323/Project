const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const User = Schema({
    email:{
        type:String,
        required :true,
    }
});

//in passpost-loacl-mongoose by default it adds the username and password to the schema with salt and hash
//the below line does all oof it
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);