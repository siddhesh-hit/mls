const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    //   phone_number: {
    //     type: String,
    //     required: true,
    //   },
    subject: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
