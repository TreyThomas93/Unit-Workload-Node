const express = require("express");
const router = express.Router();
const liveWorkloadDatabase = require("../models/liveWorkload");
<<<<<<< HEAD
const systemReportDatabase = require("../models/systemReport");
=======
const systemDatabase = require("../models/system");
>>>>>>> 47f681e79647bb19448d16c5394766307739b92b

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

<<<<<<< HEAD
// @route GET /system_log
// @desc Fetches System Log Data from MongoDB
router.get("/system_report", (req, res) => {
=======
// @route GET /system
// @desc Fetches System Data from MongoDB
router.get("/system", (req, res) => {
>>>>>>> 47f681e79647bb19448d16c5394766307739b92b

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = today
    .getFullYear()
    .toString()
    .substr(-2);
  const currentDate = mm + "/" + dd + "/" + yy;

<<<<<<< HEAD
  systemReportDatabase.find({ date: currentDate }, (err, data) => {
=======
  systemDatabase.find({ date: currentDate }, (err, data) => {
>>>>>>> 47f681e79647bb19448d16c5394766307739b92b
    if (err) throw err;
    
    res.send(JSON.stringify(data));
  });
});

module.exports = router;
