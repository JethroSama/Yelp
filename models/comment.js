const mongoose = require("mongoose");
//commets
var commentSchema = new mongoose.Schema({
  text: String,
  author: String
});
module.exports = mongoose.model("comment", commentSchema);
