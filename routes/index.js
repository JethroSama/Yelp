const express = require("express"),
User = require("../models/user"),
Comment = require("../models/comment"),
passport = require("passport"),
router = express.Router();
//---register---
//render registration page
router.get("/register", (req, res)=>{
  res.render("register");
});
//register user logic
router.post("/register", (req, res)=>{
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, data)=>{
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, ()=>{
      res.redirect("/campsites");
    });
  });
});
//-----login-----
//render login
router.get("/login", (req, res)=>{
  res.render("login");
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
  res.redirect("/campsites");
});
 //landing
  router.get("/", (req, res)=>{
    res.redirect("/campsites");
  });
//-----middleware------
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;