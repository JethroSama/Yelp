const mongoose = require("mongoose"),
Schema = mongoose.Schema,
passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  password: String,
  email: {type: String, unique: true, required: true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  avatar: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1yo1RoDHzdR73WfM_8s2mLZ0zRlUqAlH7hFEtsXMqSJrdn822v6nJCDDl&s=10"},
  avatarId: String,
  isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);