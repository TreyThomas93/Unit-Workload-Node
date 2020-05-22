const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const sslRedirect = require("heroku-ssl-redirect");
const methodOverride = require('method-override');

const app = express();

require("dotenv").config();

// Passport config
require("./config/passport")(passport);

// MongoDB Connection
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@unitworkload-kppwc.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Mongo Connected!");

mongoose.set("useFindAndModify", false);

// EJS Middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// Bodyparser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// PUT/DELETE
app.use(methodOverride('_method'));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success")
  next();
});

// enable ssl redirect
app.use(sslRedirect());

// Routes
// index
app.use("/", require("./routes/index"));

// login
app.use("/login", require("./routes/login"));

// admin
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
