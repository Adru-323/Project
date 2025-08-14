const express = require("express");
const router = express.Router();   
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")  
//sign in   form  and  sigin post form
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router.route("/login")  //login form ,logoin post form 
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: `/login`,
    failureFlash: true
}),userController.login);


//logout  // buttonn apper on navbar 
router.get("/logout",userController.logOut);


module.exports=router;