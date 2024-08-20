const express = require("express");
const router = express.Router();
const UAI = require("../mongodb_models/UserAuthenticationInformation");
const auth = require("../middleware/auth");
const User = require("../mongodb_models/User");
router.get("/", auth, async (req, res) => {
  try {
    const data = await UAI.find({ userID: req.user._id });
    res.json(data[0]);
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const lts = req.body.linkedToSpotify;
    const user = req.body.user;
    const userData = await User.find({ username: user });
    const existingID = await UAI.find({ userID: userData[0].id });

    if (existingID.length > 0) {
      res.status(400).json({
        error:
          "ID exists. Please use the appropriate update endpoints to update the status of the user.",
      });
    } else {
      const newUserPermission = new UAI({
        userID: userData[0].id,
        linkedToSpotify: lts,
      });
      // JSON data submitted should be like this at the client side
      // {user: username, linkedToSpotify: false}
      await newUserPermission.save();
      res.json(newUserPermission);
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});
module.exports = router;
