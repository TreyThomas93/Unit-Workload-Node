const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const usersDatabase = require("../../models/users");

require("dotenv").config();

router.get("/", (req, res) => {
  res.send("WORKS")
})

// @route POST /login
// @desc Logs in user
router.post("/", (req, res, next) => {
  console.log("HIT");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send("NOT VALID");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.send("VALID");
    });
  })(req, res, next);
});

module.exports = router;
