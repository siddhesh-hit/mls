const mongoose = require("mongoose");

const requestAccessSchema = new mongoose.Schema(
  {
    query: {
      type: mongoose.Schema.type.ObjectId,
      ref: "Navigation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.type.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isProvided: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestAccess", requestAccessSchema);
