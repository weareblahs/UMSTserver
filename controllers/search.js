const express = require("express");
const router = express.Router();
const Album = require("../mongodb_models/Album");
const Track = require("../mongodb_models/Track");

router.get("/album/:albumName", async (req, res) => {
  try {
    const search = await Album.fuzzySearch(req.params.albumName).populate();
    res.json(search);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/track/:trackName", async (req, res) => {
  try {
    const search = await Track.fuzzySearch({
      trackName: req.params.albumName,
    }).populate({ path: "relAlbumId" });
    res.json(search);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/albumDetails/:albumID", async (req, res) => {
  try {
    const search = await Album.findById(req.params.albumID).populate("tracks");
    res.json(search);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;
