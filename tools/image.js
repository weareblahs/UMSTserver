const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const sharp = require("sharp");
router.get("/:id/:w", (req, res) => {
  try {
    const w = parseInt(req.params.w);
    sharp(`./privData/${req.params.id}`)
      .resize(w ? w : undefined)
      .toBuffer()
      .then((data) => {
        res.contentType("image/png");
        res.end(data);
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  } catch (e) {
    return res.json({ error: e.message });
  }
});

module.exports = router;
