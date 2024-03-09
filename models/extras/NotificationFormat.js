const mongoose = require("mongoose");

const NotificationFormat = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    marathi: {
      message: {
        type: String,
        required: true,
      },
    },
    english: {
      message: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationFormat", NotificationFormat);
