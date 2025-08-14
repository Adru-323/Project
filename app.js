if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listing = require("./models/listing.js");

const ListingsRouter = require("./routes/listing.js")   // all listings routes replaced with app. to router
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// let MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL


app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
    secret:process.env.SECRET,
    },
    touchAfter:24*3600, //sec =24hr = 1day
}
);//method to create a new store 

store.on("error",()=> {
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,  //7days (7*24 = 7days) //days*hr*min*sec*mili,=days
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};




app.use(session(sessionOption));  //session created\
app.use(flash());

app.use(passport.initialize());    //for every req it will init
app.use(passport.session());          //used session 
passport.use(new LocalStrategy(User.authenticate()));
//means passport k undr jitne bhi users aye vo localstratery k through authenticcate ho paye done by user.auth which is by default added by local passport
passport.serializeUser(User.serializeUser());       //user related info is stored in the session is called seril^
passport.deserializeUser(User.deserializeUser());   //once the user is out -|-



app.use((req,res,next) => {
    res.locals.success = req.flash("success");      //we are storing the flash iin temp momery thn it can be accessable by any template ,its only used when it is flsshh before flash it is empty
    res.locals.error =req.flash("error");
    res.locals.currUser = req.user;   //logged in user info 
    next();
});


app.use("/listings",ListingsRouter);   //jaha bhi listings aye waha require kiya hua Listings use ho
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);



main().then(() =>{
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
};



// app.get("/",(req,res) => {
//     res.send("Hi, im root!")
// });




// The below code throws and unwnated error i dont know why
// app.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page not found"))
// });



//Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err})
        // res.status(statusCode).send(message);
});


app.listen(8080,() => {
    console.log("listing at port 8080");
});


