const express = require("express");
const router = express.Router();
const liveWorkloadDatabase = require("../models/liveWorkload");
const systemReportDatabase = require("../models/systemReport");

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
router.get("/system_report", (req, res) => {

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = today
    .getFullYear()
    .toString()
    .substr(-2);
  const currentDate = mm + "/" + dd + "/" + yy;

  systemReportDatabase.find({ date: currentDate }, (err, data) => {
    if (err) throw err;

    res.send(JSON.stringify(data));
  });
});

module.exports = router;
