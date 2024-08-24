const mongoose = require("mongoose");

const UAISchema = new mongoose.Schema({
  userID: { type: String },
});

module.exports = mongoose.model("UserAuthenticationInformation", UAISchema);
