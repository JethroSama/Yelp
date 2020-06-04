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
  router.post("/", (req, res)=>{
      //grab data from form
    const name = req.body.name,
          image = req.body.image,
          desc = req.body.description;
    const campsite = {name: name, image: image, description: desc};
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
//-----middleware------
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;