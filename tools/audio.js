const express = require("express");
const router = express.Router();
const fs = require("fs-extra");

router.get("/streamAudio/:albumID/:trackNumber/:format.:format", (req, res) => {
  res.setHeader("content-type", "audio/flac");
  res.download(
    `./audioStorage/${req.params.albumID}/${req.params.albumID}_${req.params.trackNumber}.${req.params.format}`
  );
});
module.exports = router;
