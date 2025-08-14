const mongoose = require("mongoose");                  //connection
const initData = require("./data.js");                   //Data file   //initData = oject 
const listing = require("../models/listing.js")          //collection table including schema


let MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connection sucess");
}).catch((err) =>{
    console.log(err);
});

async function main() {
   await mongoose.connect(MONGO_URL)
}


const initDB = async () =>{
    await listing.deleteMany({});                                  //query
    initData.data = 
    initData.data.map((obj) => ({...obj,owner:"688f76a0523d6d1f122682e4"}));// this will create a new obj with all old data additinally with owner element
    await listing.insertMany(initData.data);                       //.data is the key while init data is object
    console.log("Data was initailized");
};

initDB();



//   _id: ObjectId('688f76a0523d6d1f122682e4'),
 //   email: 'adarshasalunkhe123@gmail.com',
//    username: 'adarsh',}