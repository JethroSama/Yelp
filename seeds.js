const mongoose = require("mongoose"),
Campsite = require("./models/campsite"),
Comment = require("./models/comment");


let seed = [
  {
    name:"DemCamp",
    image:"https://images.pexels.com/photos/1309587/pexels-photo-1309587.jpeg?cs=srgb&dl=tents-on-the-ground-1309587.jpg&fm=jpg",
    description:"A camp for many people. Free food, water, and internet."
  },
  {
    name:"High Top",
    image:"https://images.pexels.com/photos/2975445/pexels-photo-2975445.jpeg?cs=srgb&dl=man-standing-on-a-rock-2975445.jpg&fm=jpg",
    description:"Rocky mountain, perfect for camping. No bugs, no animals."
  }
  ]

function seedDb(){

Campsite.deleteMany({}, (err, data)=>{
  if (err) {
    console.log(err);
  } else{
    console.log("removed campgrounds!");
    seed.forEach((camp)=>{
      Campsite.create(camp, (err, campsite)=>{
        if (err) {
          console.log(err);
        } else{
          console.log("Created campsite");
          Comment.deleteMany({}, function(err, data){
            if (err) {
              console.log(err);
            } else{
              console.log("deleted comments");
              Comment.create({text: "Nice campsite", author: "Admin"}, (err, comment)=>{
                campsite.comments.push(comment);
                campsite.save((err)=>{
                  if (err) {
                  console.log(err);
                  } else{
                  console.log("added comment");
                  }
                })
             })
            }
          })
          
        }
      })
    })
    
  }
})

}





module.exports = seedDb;