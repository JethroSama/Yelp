const mongoose = require("mongoose");
//campsiteSchema
var campsiteSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
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
