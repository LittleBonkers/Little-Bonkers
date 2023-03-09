const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../model/User");

// @route    POST api/users
// @desc     Register user
// @access   Public
const { withDraw, addScore, addEarn } = require("../../api/api");

router.post("/withdraw", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.earn != true) {
      user.earn = true;
      await user.save();
      await withDraw(user.solana_wallet, 207000);
      res.status(200).send("success");
    } else {
      res.status(400).json({ errors: [{ msg: "No Earning!" }] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/addScore", auth, async (req, res) => {
  try {
    console.log("addscore", req.user.id, req.body.score);
    await addScore(req.user.id, req.body.score);
    res.status(200).send("success");
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/addEarn", auth, async (req, res) => {
  try {
    console.log("addEarn", req.user.id, req.body.earn);
    await addEarn(req.user.id, req.body.earn);
    res.status(200).send("success");
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ "score": -1 });
    res.json(users)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

})

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, wallet } = req.body;
  try {
    let user = await User.findOne({ solana_wallet: wallet });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({
      name: name,
      solana_wallet: wallet,
      earn: 0,
      score: 0,
    });

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { wallet } = req.body;

  console.log(wallet);

  try {
    let user = await User.findOne({ solana_wallet: wallet });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
