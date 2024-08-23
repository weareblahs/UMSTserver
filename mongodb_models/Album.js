const mongoose = require("mongoose");
const AlbumSchema = new mongoose.Schema({
  albumName: { type: String },
  mainArtist: { type: String },
  albumArt: { type: String },
  albumType: { type: String },
  releaseYear: { type: String },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  copyright: { type: String },
  phonoCopyright: { type: String },
  available: { type: Boolean },
});

module.exports = mongoose.model("Albums", AlbumSchema);
