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
    logins: {
      type: Number,
    },
    login_dates: {
      type: Array,
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", usersSchema);
