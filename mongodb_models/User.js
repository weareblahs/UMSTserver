const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
