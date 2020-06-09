const express = require("express");
const router = express.Router();
const usersDatabase = require("../../models/users");
const utils = require("../../lib/utils");

require("dotenv").config();

router.post("/login", async (req, res) => {
  // Check if credentials are valid
  const response = await utils.verifyUserCredentials(req.body);

  // if error, return
  if (response.error) return res.status(400).json(response.error);

  // Assign token to user
  const token = await utils.assignToken(response._id);

  const user = {
    _id: response._id,
    name: response.name,
    username: response.username,
  };

  return res
    .header("auth_token", token)
    .status(200)
    .json({ success: true, token, user });
});

router.get("/logout", (req, res) => {
  console.log("Logged out");
  req.logout();
  res.status(200).json({ success: "User logged out!" });
});

module.exports = router;
