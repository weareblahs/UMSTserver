const express = require("express");
const router = express.Router();
const Album = require("../mongodb_models/Album");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Track = require("../mongodb_models/Track");
const albumCoverFileType = ["image/jpeg", "image/png", "image/jpg"];

const uploadAlbumInfo = multer({ dest: "./privData" });
// post album info

// will do get album once distribution portal has been done
// "sdap": "stripped-down album properties"
router.get("/sdap", auth, async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/singleAlbum/:id", auth, async (req, res) => {
  try {
    const albums = await Album.findById(req.params.id).populate("tracks");
    res.json(albums);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
router.post(
  "/addAlbumInfo",
  auth,
  uploadAlbumInfo.single("albumArt"),
  async (req, res) => {
    // WHAT TO DO: add album, upload album art via formdata. can see ecommerce for reference
    try {
      let album = new Album(req.body);
      if (req.file) album.albumArt = req.file.filename;
      album.save();
      return res.json({ album, msg: "Basic album info added successfully" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

// update existing album to include tracks
router.post("/addAlbumTrackInfo/:id", auth, async (req, res) => {
  try {
    const array = req.body;
    const album = await Album.findByIdAndUpdate(req.params.id, array, {
      new: true,
    });
    album.save();
    const albums = await Album.findById(req.params.id);
    console.log(album);
    album.save();

    res.json({ message: "Album data added successfully", albums });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/addTrackInfo", auth, async (req, res) => {
  try {
    const data = req.body;
    req.body.forEach((singleTrack) => {
      const tracks = new Track(singleTrack);
      tracks.save();
    });
    const track = await Track.find({ relAlbumId: req.body[0].relAlbumId });
    res.json(track);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/getAlbumTrack/:albumID", auth, async (req, res) => {
  try {
    const tracks = await Track.find({ relAlbumId: req.params.albumID });
    res.json(tracks);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;
