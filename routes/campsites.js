const express = require("express"),
Campsite = require("../models/campsite"),
router = express.Router();

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
  router.get("/new", isLoggedIn,(req, res)=>{
    res.render("campsites/new");
  });
  //Create
  router.post("/", isLoggedIn, (req, res)=>{
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
router.get("/:id/edit", checkOwnership,  (req, res)=>{
  Campsite.findById(req.params.id,(err, data)=>{
    if (err) {
      return res.redirect("/");
    }
    res.render("campsites/edit",{campsite: data} );
  });
});
//Update route
router.put("/:id", checkOwnership, (req,res)=>{
  Campsite.findByIdAndUpdate(req.params.id,req.body.campsite, (err)=>{
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/campsites/"+ req.params.id);
  });
});
//Destroy route
router.delete("/:id",checkOwnership, (req, res)=>{
  Campsite.findByIdAndRemove(req.params.id, (err)=>{
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/campsites");
  });
});
//-----middleware------
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkOwnership(req, res, next){
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
}

module.exports = router;