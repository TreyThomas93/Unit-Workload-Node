const mongoose = require("mongoose");

const systemReportSchema = new mongoose.Schema({}, { collection: "System" });

module.exports = mongoose.model("systemReport", systemReportSchema);
