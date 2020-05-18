//--setup--
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
//campsites Array
  const campsites = [
      {name:"Skysite", image:"https://photosforclass.com/download/pixabay-2581242?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e5dd424856ae14f6da8c7dda793f7f1636dfe2564c704c7d267ddc9f4ecc5b_1280.jpg&user=6091236"},
      {name:"Water7 site", image:"https://photosforclass.com/download/pixabay-1031360?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e0d6424954ac14f6da8c7dda793f7f1636dfe2564c704c7d267ddc9f4ecc5b_1280.jpg&user=Free-Photos"},
      {name:"Little Garden", image:"https://photosforclass.com/download/pixabay-1289930?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e2dd4a4351ac14f6da8c7dda793f7f1636dfe2564c704c7d267ddc9f4ecc5b_1280.jpg&user=pooch_eire"}
      ]
//--routes--
  //homepage
  app.get("/", (req, res)=>{
    res.render("index")
  })
  //campsites
  app.get("/campsites", (req, res)=>{
    res.render("campsites", {campsites:campsites});
  })
  
  app.get("/campsites/new", (req, res)=>{
    res.render("new")
  })
  
  app.post("/campsites", (req, res)=>{
      //grab data from form
    const name = req.body.name;
    const image = req.body.image;
    const campsite = {name: name, image: image};
      //add to array
    campsites.push(campsite);
    res.redirect("/campsites")
  })
  
//--server--
app.listen(3000, ()=>{
  console.log("server started at http://localhost:3000");
});