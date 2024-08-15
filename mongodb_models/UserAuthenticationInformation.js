const mongoose = require("mongoose");

const UAISchema = new mongoose.Schema({
  userID: { type: String },
  linkedToSpotify: { type: Boolean },
});

module.exports = mongoose.model("UserAuthenticationInformation", UAISchema);
