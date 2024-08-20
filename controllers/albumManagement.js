const express = require("express");
const router = express.Router();
const Album = require("../mongodb_models/Album");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const albumCoverFileType = ["image/jpeg", "image/png", "image/jpg"];

const uploadAlbumInfo = multer({ dest: "./privData" });
// post album info

// will do get album once distribution portal has been done

router.post(
  "/addAlbumInfo",
  auth,
  uploadAlbumInfo.single("albumArt"),
  async (req, res) => {
    // WHAT TO DO: add album, upload album art via formdata. can see ecommerce for reference
    try {
      console.log(req.body);
      let album = new Album(req.body);
      if (req.file) album.albumArt = req.file.filename;
      album.save();
      return res.json({ album, msg: "Album added successfully" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

module.exports = router;
