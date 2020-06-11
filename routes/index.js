const express = require("express"),
User = require("../models/user"),
Comment = require("../models/comment"),
Campsite = require("../models/campsite"),
passport = require("passport"),
router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'jethrosama', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//---register---
//render registration page
router.get("/register", (req, res)=>{
  res.render("register", {page: "register"});
});
//register user logic
router.post("/register", upload.single('avatar'), (req, res)=>{
  cloudinary.uploader.upload(req.file.path, function(result){
    const newUser = new User({
      username: req.body.username,
      avatar: cloudinary.url(result.public_id+ ".jpg", {width: 90, height: 90, crop: "thumb", gravity: "face"}),
      avatarId: result.public_id
    });
    if(req.body.adminCode === process.env.ADMIN_CODE){
    newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, data)=>{
      if (err) {
        return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, ()=>{
        req.flash("success", "Welcome to Yelp Camp, "+ data.username);
        res.redirect("/campsites");
      });
    });
  });
});
//-----login-----
//render login
router.get("/login", (req, res)=>{
  res.render("login", {page: "login"});
});
//login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campsites",
  failureRedirect: "/login"
}), (req, res)=>{
});

//-----logout-----
router.get("/logout", (req, res)=>{
  req.logout();
  req.flash("success", "Succesfully logged out");
  res.redirect("/campsites");
});
 //landing
  router.get("/", (req, res)=>{
    res.render("landing");
  });
//-----middleware------
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
//USER PROFILE
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, (err, user)=>{
    if (err) {
      console.log(err);
      req.flash("error", "something went wrong");
      return res.redirect("/campsites");
    }
    Campsite.find().where("author.id").equals(user._id).exec((err, campsites)=>{
      if (err) {
      console.log(err);
      req.flash("error", "something went wrong");
      return res.redirect("/campsites");
    }
      res.render("./user/show", {user: user, campsites: campsites});
    });
  });
});
module.exports = router;