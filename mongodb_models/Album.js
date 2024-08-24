const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("@rowboat/mongoose-fuzzy-searching");
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
AlbumSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["albumName", "mainArtist"],
});
module.exports = mongoose.model("Albums", AlbumSchema);
