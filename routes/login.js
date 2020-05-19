const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const usersDatabase = require("../models/users");

require("dotenv").config();

// @route GET /login
// @desc Renders login page
router.get("/", (req, res) => {
  res.render("login");
});

// @route POST /login
// @desc Logs in user
router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// router.get("/generate", (req, res) => {
//   const password = "password!";
//   const saltRounds = 10;
//   bcrypt.genSalt(saltRounds, function (err, salt) {
//     bcrypt.hash(password, salt, function (err, hash) {
//       // Store hash in your password DB.
//       console.log(hash);
//     });
//   });
// });

module.exports = router;
