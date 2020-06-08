const Comment = require("../models/comment"),
Campsite = require("../models/campsite");

//middleware
const middleware = {};
middleware.isLoggedIn = (req, res, next)=>{
  if (req.isAuthenticated()) {
    return next();
  }
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
          res.redirect("back");
        }
      }
    });
  } else{
    res.redirect("back");
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
    res.redirect("back");
  });
  } else{
    res.redirect("back");
  }
};
module.exports = middleware;