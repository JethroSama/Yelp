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
//EDIT ROUTE
router.get("/:comment_id/edit", isAuthorized, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if (err) {
      res.redirect("back");
    } else{
      res.render("comments/edit", {comment: comment, campsiteId: req.params.id});
    }
  });
});
//UPDATE ROUTE
router.put("/:comment_id", isAuthorized, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
    if (err) {
      res.redirect("back");
    } else{
      res.redirect("/campsites/"+req.params.id);
    }
  });
});
//DELETE ROUTE
router.delete("/:comment_id", isAuthorized, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if (err) {
      res.redirect("back");
    } else{
      res.redirect("/campsites/"+ req.params.id);
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
function isAuthorized(req, res, next){
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
}

module.exports = router;