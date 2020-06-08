const express = require("express");
const router = express.Router();
const usersDatabase = require("../../models/users");
const utils = require("../../lib/utils");

require("dotenv").config();

router.post("/login", (req, res) => {
  utils
    .verifyUserCredentials(req.body)
    .then((payload) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  console.log("Logged out");
  req.logout();
  res.status(200).json({ success: "User logged out!" });
});

module.exports = router;
