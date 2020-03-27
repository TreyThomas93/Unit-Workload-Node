const express = require("express");
const router = express.Router();
const liveWorkloadDatabase = require("../models/liveWorkload");
const systemLogDatabase = require("../models/systemLog");

require("dotenv").config();

// @route GET /
// @desc Renders index page
router.get("/", (req, res) => {
  res.render("index");
});

// @route GET /live_workload
// @desc Fetches Live Workload Data from MongoDB
router.get("/live_workload", (req, res) => {
  liveWorkloadDatabase.find({}, (err, data) => {
    if (err) throw err;

    res.send(JSON.stringify(data));
  });
});

// @route GET /system_log
// @desc Fetches System Log Data from MongoDB
router.get("/system_logs", (req, res) => {
  systemLogDatabase.find({}, (err, data) => {
    if (err) throw err;

    res.send(JSON.stringify(data));
  });
});

module.exports = router;
