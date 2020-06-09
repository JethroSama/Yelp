const express = require("express"),
Campsite = require("../models/campsite"),
Comment = require("../models/comment"),
router = express.Router({mergeParams: true}),
middleware = require("../middleware");

    //new
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  Campsite.findById(req.params.id, (err, campsite)=>{
    if (err) {
      console.log(err);
    } else{
      res.render("comments/new", {campsite: campsite});
    }
  });
});
  //create
router.post("/", middleware.isLoggedIn, (req, res)=>{
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
              req.flash("success", "Added Comment")
              res.redirect("/campsites/" + campsite._id);
            }
          });
        }
      });
    }
  });
});
//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if (err) {
      res.redirect("back");
    } else{
      res.render("comments/edit", {comment: comment, campsiteId: req.params.id});
    }
  });
});
//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
    if (err) {
      res.redirect("back");
    } else{
      req.flash("success", "Comment Updated");
      res.redirect("/campsites/"+req.params.id);
    }
  });
});
//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if (err) {
      res.redirect("back");
    } else{
      req.flash("success", "Comment Removed");
      res.redirect("/campsites/"+ req.params.id);
    }
  });
});
module.exports = router;