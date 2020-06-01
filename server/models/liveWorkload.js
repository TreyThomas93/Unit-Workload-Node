const mongoose = require("mongoose");

const liveWorkloadSchema = new mongoose.Schema(
  {},
  { collection: "liveWorkload" }
);

module.exports = mongoose.model("liveWorkload", liveWorkloadSchema);
