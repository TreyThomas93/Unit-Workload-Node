const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
                User.findOneAndUpdate(
                  { username },
                  { $inc: { logins: 1 } },
                  { upsert: true },
                  (err, res) => {
                    if (err) throw err;

                    console.log(res);
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
