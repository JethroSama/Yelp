const express = require("express"),
Campsite = require("../models/campsite"),
Comment = require("../models/comment"),
router = express.Router(),
middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'jethrosama', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

  //campsites index
  router.get("/", (req, res)=>{
    //grab campsites from db
    Campsite.find({}, function(err, data){
      if(err){
        console.log(err);
      } else{
        //send the data to campsites.ejs
        res.render("campsites/index", {campsites:data, page: "campsites"});
      }
    });
  });
  //New 
  router.get("/new", middleware.isLoggedIn,(req, res)=>{
    res.render("campsites/new");
  });
  //Create
  router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res)=>{
      cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
    req.body.campsite.image = result.secure_url;
    req.body.campsite.imageId = result.public_id;
  // add author to campground
    req.body.campsite.author = {
    id: req.user._id,
    username: req.user.username
  }
    Campsite.create(req.body.campsite, function(err, campsite) {
      if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
      }
      res.redirect('/campsites/' + campsite.id);
    });
  });
});
//SHOW
router.get("/:id", (req, res)=>{
    const id = req.params.id;
    Campsite.findById(id).populate("comments").exec((err, data)=>{
      if(err || !data){
        req.flash("error", "Campsite not found");
        res.redirect("/campsites");
      } else{
        res.render("campsites/show", {campsite: data});
      }
    });
});

//EDIT CAMPSITE ROUTE
//show edit page
router.get("/:id/edit", middleware.checkCampsiteOwnership,(req, res)=>{
  Campsite.findById(req.params.id,(err, data)=>{
    if (err) {
      return res.redirect("back");
    }
    res.render("campsites/edit",{campsite: data} );
  });
});
//Update route
router.put("/:id", middleware.checkCampsiteOwnership, upload.single('image'), (req,res)=>{
  Campsite.findById(req.params.id, async function(err, campsite){
    if (err) {
      return res.redirect("back")
    }
    if(req.file){
      try{
        await cloudinary.v2.uploader.destroy(campsite.imageId);
        let result = await cloudinary.v2.uploader.upload(req.file.path);
        campsite.image = result.secure_url;
        campsite.imageId = result.public_id;
      } catch(err){
        if (err) {
          console.log(err)
          return res.redirect("back")
        }
      }
    }
    campsite.price = req.body.price;
    campsite.name = req.body.name;
    campsite.description = req.body.description;
    campsite.save();
    req.flash("success", "Updated Campsite");
    res.redirect("/campsites/"+ req.params.id);
  })
});
//Destroy route
router.delete("/:id", middleware.checkCampsiteOwnership, (req, res)=>{
  Campsite.findByIdAndRemove(req.params.id,async function(err, campsite){
    if (err) {
      return res.redirect("/");
    }
    try {
      await cloudinary.v2.uploader.destroy(campsite.imageId);
      Comment.deleteMany({_id:{
      $in: campsite.comments
      }})
    } catch(err){
      if (err) {
        console.log(err);
        return res.redirect("back");
      }
    }
    req.flash("success", "Campsite Deleted")
    res.redirect("/campsites");
  });
});
module.exports = router;