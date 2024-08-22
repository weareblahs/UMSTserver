const mongoose = require("mongoose");
const AlbumSchema = new mongoose.Schema({
  albumName: { type: String },
  mainArtist: { type: String },
  albumArt: { type: String },
  albumType: { type: String },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
});

module.exports = mongoose.model("Albums", AlbumSchema);
