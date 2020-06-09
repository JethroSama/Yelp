const Comment = require("../models/comment"),
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

middleware.checkCommentOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment)=>{
      if (err) {
        res.redirect("back");
      } else{
        //check if user owns comment
        if (comment.author.id.equals(req.user.id)) {
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
    if (err) {
      return res.redirect("back");
    }
    //Check if the author id matches the currend user id
    if (data.author.id.equals(req.user.id)) {
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