const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({}, { collection: "system" });

module.exports = mongoose.model("System", systemSchema);
