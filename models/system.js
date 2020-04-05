const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({}, { collection: "System" });

module.exports = mongoose.model("System", systemSchema);
