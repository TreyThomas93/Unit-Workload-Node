const jwt = require("jsonwebtoken");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

require("dotenv").config();

function verifyUserCredentials(user) {
  const { username, password } = user;

  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((res) => {
            resolve(user);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => reject(err));
  });
}

module.exports.verifyUserCredentials = verifyUserCredentials;
