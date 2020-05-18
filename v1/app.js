//--setup--
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");
//campsites Array
  const campsites = [
      {name:"Skysite", image:"https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?cs=srgb&dl=tent-near-tree-2603681.jpg&fm=jpg"},
      {name:"Water7 site", image:"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?cs=srgb&dl=tents-surrounded-by-trees-1309584.jpg&fm=jpg"},
      {name:"Little Garden", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?cs=srgb&dl=six-camping-tents-in-forest-699558.jpg&fm=jpg"},
      {name:"Skysite", image:"https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?cs=srgb&dl=tent-near-tree-2603681.jpg&fm=jpg"},
      {name:"Water7 site", image:"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?cs=srgb&dl=tents-surrounded-by-trees-1309584.jpg&fm=jpg"},
      {name:"Little Garden", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?cs=srgb&dl=six-camping-tents-in-forest-699558.jpg&fm=jpg"},
      {name:"Skysite", image:"https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?cs=srgb&dl=tent-near-tree-2603681.jpg&fm=jpg"},
      {name:"Water7 site", image:"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?cs=srgb&dl=tents-surrounded-by-trees-1309584.jpg&fm=jpg"},
      {name:"Little Garden", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?cs=srgb&dl=six-camping-tents-in-forest-699558.jpg&fm=jpg"},
      {name:"Skysite", image:"https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?cs=srgb&dl=tent-near-tree-2603681.jpg&fm=jpg"},
      {name:"Water7 site", image:"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?cs=srgb&dl=tents-surrounded-by-trees-1309584.jpg&fm=jpg"},
      {name:"Little Garden", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?cs=srgb&dl=six-camping-tents-in-forest-699558.jpg&fm=jpg"},
      {name:"Skysite", image:"https://images.pexels.com/photos/2603681/pexels-photo-2603681.jpeg?cs=srgb&dl=tent-near-tree-2603681.jpg&fm=jpg"},
      {name:"Water7 site", image:"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?cs=srgb&dl=tents-surrounded-by-trees-1309584.jpg&fm=jpg"},
      {name:"Little Garden", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?cs=srgb&dl=six-camping-tents-in-forest-699558.jpg&fm=jpg"}
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