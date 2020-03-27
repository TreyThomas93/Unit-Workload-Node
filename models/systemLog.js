const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema({}, { collection: "systemLog" });

module.exports = mongoose.model("systemLog", systemLogSchema);
