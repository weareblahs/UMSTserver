const mongoose = require("mongoose");
const AlbumSchema = new mongoose.Schema({
  albumName: { type: String },
  artist: { type: String },
  albumArt: { type: String },
  albumType: { type: String },
  tracklist: { type: Map, of: String },
});

module.exports = mongoose.model("Albums", AlbumSchema);
