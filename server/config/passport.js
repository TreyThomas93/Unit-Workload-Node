const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// USE .ENV FILE
require("dotenv").config();

// Load User Model
const User = require("../models/users");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) done(null, user);
      else done(null, false); 
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};
