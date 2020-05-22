const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { ensureAuthenticated } = require("../config/auth");
const usersDatabase = require("../models/users");

require("dotenv").config();

// @route GET /admin
// @desc Renders admin page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("admin");
});

// @route GET /users
// @desc Fetches all users
router.get("/users", (req, res) => {
  usersDatabase.find({}, (err, data) => {
    if (err) throw err;

    res.send(JSON.stringify(data));
  });
});

// @route POST /admin
// @desc Adds user
router.post("/", (req, res) => {
  const { name, username, password, confirmPassword } = req.body;

  if (name && username && password && confirmPassword) {
    if (password !== confirmPassword) {
      req.flash("error", "Passwords Do Not Match!");
    } else {
      req.flash("success", "User Added!");

      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          // Store hash in your password DB.
          usersDatabase.create({
            name,
            username,
            password: hash,
          });
        });
      });
    }
  } else {
    req.flash("error", "Empty Fields!");
  }

  res.redirect("/admin");
});

// @route PUT /admin
// @desc Update user
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, username, password, confirmPassword } = req.body;

  if (name && username) {
    // Change Password
    if (password != "") {
      if (password === confirmPassword) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            usersDatabase
              .findByIdAndUpdate(id, {
                name,
                username,
                password: hash,
              })
              .then((dbres) => {})
              .catch((err) => console.log(err));
          });
        });

        req.flash("success", "User Updated!");
      } else {
        req.flash("error", "Passwords Do Not Match!");
      }
    } else {
      usersDatabase
        .findByIdAndUpdate(id, {
          name,
          username,
        })
        .then((dbres) => {})
        .catch((err) => console.log(err));

      req.flash("success", "User Updated!");
    }
  } else {
    req.flash("error", "Empty Name or Username Fields!");
  }

  res.redirect("/admin");
});

// @route DELETE /admin
// @desc Removes user
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  usersDatabase
    .findByIdAndDelete(id)
    .then((dbres) => {
      req.flash("success", "User Removed!");
      res.redirect("/admin");
    })
    .catch((err) => {
      req.flash("error", "Error");
      res.redirect("/admin");
    });
});

module.exports = router;
