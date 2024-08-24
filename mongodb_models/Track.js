const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("@rowboat/mongoose-fuzzy-searching");
const TrackSchema = new mongoose.Schema({
  relAlbumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  trackNo: { type: Number },
  trackName: { type: String },
  trackArtist: { type: String },
  label: { type: String },
});
TrackSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["trackName", "trackArtist"],
});
module.exports = mongoose.model("Track", TrackSchema);
