const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
