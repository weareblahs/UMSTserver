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
const ffmpegPath = require("ffmpeg-static");
const childProcess = require("child_process");
// post album info

// will do get album once distribution portal has been done
// "sdap": "stripped-down album properties"
router.get("/sdap", async (req, res) => {
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
      fs.mkdir(`./audioStorage/${req.params.id}`);
      files.forEach((singleFile) => {
        fs.rename(
          `./privData/${singleFile.originalname}`,
          `./privData/${req.params.id}/${req.params.id}_${singleFile.originalname}`
        );
        // flac encoding
        files.forEach(async (singleFile) => {
          const ffmpegProcess = childProcess.spawn(ffmpegPath, [
            "-i",
            `./privData/${req.params.id}/${req.params.id}_${singleFile.originalname}`,
            `./audioStorage/${req.params.id}/${
              req.params.id
            }_${singleFile.originalname.slice(0, -4)}.flac`,
          ]);
          ffmpegProcess.on("error", () => {
            // catches execution error (bad file)
            console.log(`Error executing binary: ${ffmpegPath}`);
          });

          ffmpegProcess.stdout.on("data", (data) => {
            console.log(data.toString());
          });

          ffmpegProcess.stderr.on("data", (data) => {
            console.log(data.toString());
          });

          ffmpegProcess.on("close", (code) => {
            console.log(`Process exited with code: ${code}`);
            if (code === 0) {
              console.log(`FFmpeg finished successfully`);
            } else {
              console.log(
                `FFmpeg encountered an error, check the console output`
              );
            }
          });
        });
      });
      res.json({ status: "Files successfully uploaded to servers" });

      // res.json(req.files);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.delete("/deleteAlbum/:id", auth, async (req, res) => {
  try {
    const albumInfo = await Album.findById(req.params.id);
    const album = await Album.findByIdAndDelete(req.params.id);
    const track = await Track.deleteMany({ relAlbumId: req.params.id });
    // delete album audio
    albumInfo?.albumArt
      ? fs.unlinkSync(`./privData/${albumInfo.albumArt}`)
      : null;
    fs.rmSync(`./privData/${req.params.id}`, { recursive: true, force: true });
    fs.rmSync(`./audioStorage/${req.params.id}`, {
      recursive: true,
      force: true,
    });
    res.json({ status: `Album with ID ${req.params.id} deleted successfully` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/addCopyrightInfo/:id", auth, async (req, res) => {
  try {
    const updateInfo = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    updateInfo.save();
    res.json({ status: "Update successful", updateInfo });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/setAvailable/:id/:bool", auth, async (req, res) => {
  try {
    const setInfo = await Album.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.params.bool },
      { new: true }
    );
    setInfo.save();
    res.json({ status: "Update successful", setInfo });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/toggleAlbumAvailability/:id/:opts", auth, async (req, res) => {
  try {
    if (req.params.opts == "view") {
      const result = await Album.findById(req.params.id);
      res.json(result.available);
    } else if (req.params.opts == "true" || req.params.opts == "false") {
      const result = await Album.findByIdAndUpdate(
        req.params.id,
        {
          available: req.params.opts,
        },
        { new: true }
      );
      result.save();
      res.json(result.available);
    } else {
      res.status(400).json({ error: "Invalid value" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;
