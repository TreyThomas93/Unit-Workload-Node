const jwt = require("jsonwebtoken");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const moment = require("moment");

require("dotenv").config();

function verifyUserCredentials(user) {
  const { username, password } = user;
  const error = "Invalid Username and/or Password";

  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, isMatched) => {
            if (isMatched) resolve(user);

            resolve({ error });
          });
        } else {
          resolve({ error });
        }
      })
      .catch((err) => reject({ error: err }));
  });
}

function assignToken(userId) {
  return jwt.sign({ _id: userId }, process.env.PUB_KEY, {
    expiresIn: process.env.expiresIn,
  });
}

function verifyToken(req, res, next) {
  const bearerToken = req.headers["authorization"];

  const token = bearerToken.split(" ")[1];

  const found = jwt.verify(token, process.env.PUB_KEY);

  if (found) next();
  else return res.status(403).json({ error: "Invalid Token" });
}

function logLoginDateTime(user) {
  let timeStamp = moment().format("MM/DD/YY HH:mm:ss");
  User.findOneAndUpdate(
    { username: user.username },
    {
      $inc: { logins: 1 },
      $push: {
        login_dates: timeStamp,
      },
    },
    { upsert: true }
  )
    .then((res) => {})
    .catch((err) => console.log(err));
}

module.exports.verifyUserCredentials = verifyUserCredentials;
module.exports.assignToken = assignToken;
module.exports.verifyToken = verifyToken;
module.exports.logLoginDateTime = logLoginDateTime;
