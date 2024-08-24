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
    const search = await Track.fuzzySearch(req.params.trackName).populate(
      "relAlbumId"
    );
    res.json(search);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/albumDetails/:albumID", async (req, res) => {
  try {
    const search = await Album.findById(req.params.albumID);
    const tracks = await Track.find({ relAlbumId: req.params.albumID });
    data = tracks.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
    });
    res.json({ search, tracks });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;

router.get("/singleTrack/:albumID/:trackPos", async (req, res) => {
  try {
    const search = await Track.find({
      relAlbumId: req.params.albumID,
      trackNo: parseInt(req.params.trackPos),
    }).populate({
      path: "relAlbumId",
      select: "albumName",
      select: "mainArtist",
      select: "albumArt",
      select: "-_id",
      select: "-tracks",
    });
    res.json(search[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
