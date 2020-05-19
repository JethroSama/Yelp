//--setup--
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://jethrosama:undeadban07@master-2viyl.mongodb.net/YelpCamp?retryWrites=true&w=majority");
//bodyparser
app.use(bodyParser.urlencoded({extended:true}));
//express
app.use(express.static("public"));
app.set("view engine", "ejs");

//campsiteSchema
var campsiteSchema = new mongoose.Schema({
  name: String,
  image: String
});
//Campsite db
var Campsite = mongoose.model("campsite", campsiteSchema);


//--routes--
  //homepage
  app.get("/", (req, res)=>{
    res.render("index")
  })
  //campsites
  app.get("/campsites", (req, res)=>{
    //grab campsites from db
    Campsite.find({}, function(err, data){
      if(err){
        console.log(err)
      } else{
        //send the data to campsites.ejs
        res.render("campsites", {campsites:data});
      }
    })
  })
  //new campsites page
  app.get("/campsites/new", (req, res)=>{
    res.render("new")
  })
  //post route from new
  app.post("/campsites", (req, res)=>{
      //grab data from form
    const name = req.body.name;
    const image = req.body.image;
    const campsite = {name: name, image: image};
      //add to database
      Campsite.create(campsite, function(err, data){
    if(err){
      console.log(err)
    } else{
      //redirect to campsites
      res.redirect("/campsites")
    }
  })
})
  
//--server--
app.listen(3000, ()=>{
  console.log("server started at http://localhost:3000");
});