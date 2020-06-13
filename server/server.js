const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const sslRedirect = require("heroku-ssl-redirect");
const methodOverride = require("method-override");
var cors = require("cors");

// APP INIT
const app = express();

// CORS INIT
app.use(cors());

// USE .ENV FILE
require("dotenv").config();

/**
 *          MONGOOSE/MONGODB
 */
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@unitworkload-kppwc.mongodb.net/EMSAEastern?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Mongo Connected!");
mongoose.set("useFindAndModify", false);
/////////////////////////////////////////////////////////////////////////

// BODYPARSER
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// PUT/DELETE
app.use(methodOverride("_method"));

// SSL REDIRECT
app.use(sslRedirect());

// ROUTES

/**
 *          API
 */
// ADMIN
app.use("/api/admin", require("./routes/api/admin"));

// DASHBOARD
app.use("/api/workload", require("./routes/api/workload"));
////////////////////////////////////////////////////////////////////////

/**
 *          AUTH
 */
app.use("/auth", require("./routes/auth/auth"));
////////////////////////////////////////////////////////////////////////

// Handle Production
if (process.env.NODE_ENV === "production") {
  // Static Folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

// DETERMINE PORT & LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
