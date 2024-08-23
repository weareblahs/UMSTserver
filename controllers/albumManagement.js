const express = require("express");
const router = express.Router();
const Album = require("../mongodb_models/Album");
const auth = require("../middleware/auth");
const fs = require("fs-extra");
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
    const albums = await Album.findById(req.params.id).populate({
      path: "tracks",
      options: { sort: { trackNo: 1 } },
    });
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
    console.log(req.body);
    const album = await Album.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    console.log(album);

    res.json({ message: "Album data added successfully", album });
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
const audioFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "privData/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadAudio = multer({ storage: audioFileStorage });
router.post(
  "/AcceptUploadedFiles/:id",
  auth,
  uploadAudio.array("tracks", 128),
  (req, res) => {
    try {
      fs.mkdir(`./privData/${req.params.id}`);
      const files = req.files;
      files.forEach((singleFile) => {
        fs.rename(
          `./privData/${singleFile.originalname}`,
          `./privData/${req.params.id}/${req.params.id}_${singleFile.originalname}`
        );
        res.json({ status: "Files successfully uploaded to servers" });
      });
      // res.json(req.files);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.delete("/deleteAlbum/:id", auth, async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    const track = await Track.deleteMany({ relAlbumID: req.params.albumID });
    res.json({ status: `Album with ID ${req.params.id} deleted successfully` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;
