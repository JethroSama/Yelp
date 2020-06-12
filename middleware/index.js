const Comment = require("../models/comment"),
User = require("../models/user"),
Campsite = require("../models/campsite");

//middleware
const middleware = {};
middleware.isLoggedIn = (req, res, next)=>{
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to do that");
  res.redirect("/login");
};

middleware.checkUser = (req, res, next)=>{
  if (req.isAuthenticated()) {
    User.findById(req.params.id, (err, user)=>{
      if (err) {
        res.redirect("back");
      } else{
        //check if user owns comment
        if (user._id.equals(req.user.id) || req.user && req.user.isAdmin) {
          next();
        } else{
          req.flash("error", "You don't have permission to do that");
    res.redirect("/users/"+ req.params.id);
        }
      }
    });
  } else{
    req.flash("error", "You must be logged in to do that");
    res.redirect("/campsites");
  }
};
middleware.checkCommentOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment)=>{
      if (err) {
        res.redirect("back");
      } else{
        //check if user owns comment
        if (comment.author.id.equals(req.user.id) || req.user && req.user.isAdmin) {
          next();
        } else{
          req.flash("error", "You don't have permission to do that");
    res.redirect("/campsites/"+ req.params.id);
        }
      }
    });
  } else{
    req.flash("error", "You must be logged in to do that");
    res.redirect("/campsites/"+ req.params.id);
  }
};

middleware.checkCampsiteOwnership = (req, res, next)=>{
  //check if logged in
  if (req.isAuthenticated()) {
    Campsite.findById(req.params.id,(err, data)=>{
    if (err || !data) {
      req.flash("error", "Campsite not found");
      return res.redirect("/campsites");
    }
    //Check if the author id matches the currend user id
    if (data.author.id.equals(req.user.id) || req.user && req.user.isAdmin) {
      return next();
    }
    req.flash("error", "You don't have permission to do that");
    res.redirect("/campsites/"+ req.params.id);
  });
  } else{
    req.flash("error", "You must be logged in to do that");
    res.redirect("/campsites/"+ req.params.id);
  }
};
module.exports = middleware;