const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    unit: {
      type: Number,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", usersSchema);
