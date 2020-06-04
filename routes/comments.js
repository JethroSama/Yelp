const express = require("express"),
Campsite = require("../models/campsite"),
Comment = require("../models/comment"),
router = express.Router({mergeParams: true});

    //new
router.get("/new", isLoggedIn, (req, res)=>{
  Campsite.findById(req.params.id, (err, campsite)=>{
    if (err) {
      console.log(err);
    } else{
      res.render("comments/new", {campsite: campsite});
    }
  });
});
  //create
router.post("/",isLoggedIn, (req, res)=>{
  Campsite.findById(req.params.id, (err, campsite)=>{
    if (err) {
      console.log(err);
    } else{
      Comment.create(req.body.comment, (err, comment)=>{
        if (err) {
          console.log(err);
        } else{
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campsite.comments.push(comment);
          campsite.save((err)=>{
            if (err) {
              console.log(err);
            } else{
              res.redirect("/campsites/" + campsite._id);
            }
          });
        }
      });
    }
  });
});
//-----middleware------
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;