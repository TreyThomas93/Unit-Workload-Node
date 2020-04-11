const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

// MongoDB Connection
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@unitworkload-kppwc.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Mongo Connected!");

// EJS Middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// Routes
// index
app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
