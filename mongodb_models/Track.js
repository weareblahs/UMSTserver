const mongoose = require("mongoose");
const AlbumSchema = new mongoose.Schema({
  relAlbumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  trackNo: { type: Number },
  trackName: { type: String },
  trackArtist: { type: String },
  relatedAudio: { type: String },
});

module.exports = mongoose.model("Track", AlbumSchema);
