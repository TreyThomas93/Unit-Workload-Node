const express = require("express");
const router = express.Router();
const { verifyToken, encryptPassword } = require("../../lib/utils");
const userDatabase = require("../../models/users");

require("dotenv").config();

// @route GET /users
// @desc Fetches System Log Data from MongoDB
router.post("/users", verifyToken, (req, res) => {
  userDatabase.find({}, (err, data) => {
    if (err) throw err;

    res.send(JSON.stringify(data));
  });
});

router.post("/add_user", verifyToken, async (req, res) => {
  const { name, username, password, confirm_password, isAdmin } = req.body;

  const user = {
    name,
    username,
    password: await encryptPassword(password),
    admin: isAdmin,
  };

  userDatabase
    .create(user)
    .then()
    .catch((err) => console.log(err));

  res.status(200).json({ success: true });
});

router.post("/edit_user", verifyToken, async (req, res) => {
  const {
    id,
    name,
    username,
    password,
    confirm_password,
    isAdmin,
    changePassword,
  } = req.body;

  let user;

  if (changePassword) {
    user = {
      name,
      username,
      password: await encryptPassword(password),
      admin: isAdmin,
    };
  } else {
    user = {
      name,
      username,
      admin: isAdmin,
    };
  }

  userDatabase
    .findByIdAndUpdate(id, user)
    .then()
    .catch((err) => console.log(err));

  res.status(200).json({ success: true });
});

router.post("/delete_user", verifyToken, (req, res) => {
  const id = req.body.id;

  userDatabase
    .findByIdAndDelete(id)
    .then(() => {})
    .catch((err) => console.log(err));

  res.status(200).json({ success: true });
});

module.exports = router;
