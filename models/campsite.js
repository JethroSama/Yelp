const mongoose = require("mongoose");
//campsiteSchema
var campsiteSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  imageId: String,
  description: String,
  createdAt: {type: Date, default: Date.now},
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment"
  }],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }

});
module.exports = mongoose.model("campsite", campsiteSchema);
