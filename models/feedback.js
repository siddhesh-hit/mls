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
    //   address: {
    //     type: String,
    //   },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
