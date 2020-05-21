const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");

// Load User Model
const User = require("../models/users");

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        // Match User
        User.findOne({ username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "Username Incorrect!",
              });
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatched) => {
              if (err) throw err;

              if (isMatched) {
                let timeStamp = moment().format("MM/DD/YY HH:mm:ss");

                User.findOneAndUpdate(
                  { username },
                  {
                    $inc: { logins: 1 },
                    $push: {
                      login_dates: timeStamp,
                    },
                  },
                  { upsert: true },
                  (err, res) => {
                    if (err) throw err;
                  }
                );
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect!" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
