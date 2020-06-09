const express = require("express"),
Campsite = require("../models/campsite"),
Comment = require("../models/comment"),
router = express.Router(),
middleware = require("../middleware");

  //campsites index
  router.get("/", (req, res)=>{
    //grab campsites from db
    Campsite.find({}, function(err, data){
      if(err){
        console.log(err);
      } else{
        //send the data to campsites.ejs
        res.render("campsites/index", {campsites:data});
      }
    });
  });
  //New 
  router.get("/new", middleware.isLoggedIn,(req, res)=>{
    res.render("campsites/new");
  });
  //Create
  router.post("/", middleware.isLoggedIn, (req, res)=>{
      //grab data from form
    const name = req.body.name,
          image = req.body.image,
          desc = req.body.description,
          author = {
            id: req.user._id,
            username: req.user.username
          };
    const campsite = {
      name: name,
      image: image,
      description: desc,
      author: author
      };
      //add to database
      Campsite.create(campsite, function(err, data){
    if(err){
      console.log(err);
    } else{
      req.flash("success", "Campsite Created")
      //redirect to campsites
      res.redirect("/campsites");
    }
  });
});
//SHOW
router.get("/:id", (req, res)=>{
    const id = req.params.id;
    Campsite.findById(id).populate("comments").exec((err, data)=>{
      if(err){
        console.log(err);
      } else{
        res.render("campsites/show", {campsite: data});
      }
    });
});

//EDIT CAMPSITE ROUTE
//show edit page
router.get("/:id/edit", middleware.checkCampsiteOwnership,  (req, res)=>{
  Campsite.findById(req.params.id,(err, data)=>{
    if (err) {
      return res.redirect("back");
    }
    res.render("campsites/edit",{campsite: data} );
  });
});
//Update route
router.put("/:id", middleware.checkCampsiteOwnership, (req,res)=>{
  Campsite.findByIdAndUpdate(req.params.id,req.body.campsite, (err)=>{
    if (err) {
      return res.redirect("back");
    }
    req.flash("success", "Updated Campsite")
    res.redirect("/campsites/"+ req.params.id);
  });
});
//Destroy route
router.delete("/:id", middleware.checkCampsiteOwnership, (req, res)=>{
  Campsite.findByIdAndRemove(req.params.id, (err, campsite)=>{
    if (err) {
      return res.redirect("/");
    }
    Comment.deleteMany({_id:{
      $in: campsite.comments
    }}, (err, comment)=>{
      if (err) {
        return res.redirect("back");
      }
      req.flash("success", "Campsite Deleted")
      res.redirect("/campsites");
    });
  });
});
module.exports = router;