const mongoose = require("mongoose"),
Campsite = require("./models/campsite"),
Comment = require("./models/comment");


let seed = [
  {
    name:"DemCamp",
    image:"https://images.pexels.com/photos/1309587/pexels-photo-1309587.jpeg?cs=srgb&dl=tents-on-the-ground-1309587.jpg&fm=jpg",
    description:"A camp for many people. Free food, water, and internet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed in eros in ligula lobortis suscipit. Nulla sagittis, velit eget cursus pretium, sem lorem mollis elit, in ultricies erat purus vitae leo. Cras volutpat tortor tortor, id sagittis lorem venenatis id. Phasellus et nisi nec nibh egestas semper sit amet sed ex. Mauris ultricies orci eu magna porttitor convallis. Fusce eu ultricies sem. Maecenas vehicula felis at augue fermentum, in pretium ligula fermentum. Quisque non accumsan ligula. Sed leo ligula, feugiat id tortor vitae, sagittis auctor turpis. Donec a blandit ante. Donec eget rutrum lectus, id varius nibh."
  },
  {
    name:"High Top",
    image:"https://images.pexels.com/photos/2975445/pexels-photo-2975445.jpeg?cs=srgb&dl=man-standing-on-a-rock-2975445.jpg&fm=jpg",
    description:"Rocky mountain, perfect for camping. No bugs, no animals.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed in eros in ligula lobortis suscipit. Nulla sagittis, velit eget cursus pretium, sem lorem mollis elit, in ultricies erat purus vitae leo. Cras volutpat tortor tortor, id sagittis lorem venenatis id. Phasellus et nisi nec nibh egestas semper sit amet sed ex. Mauris ultricies orci eu magna porttitor convallis. Fusce eu ultricies sem. Maecenas vehicula felis at augue fermentum, in pretium ligula fermentum. Quisque non accumsan ligula. Sed leo ligula, feugiat id tortor vitae, sagittis auctor turpis. Donec a blandit ante. Donec eget rutrum lectus, id varius nibh."
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