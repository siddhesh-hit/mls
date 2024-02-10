const mongoose = require("mongoose");

const debateSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    session: {
      type: String,
    },
    house: {
      type: String,
    },
    year: {
      type: String,
    },
    volume: {
      type: String,
    },
    kramank: {
      type: String,
    },
    date: {
      type: String,
    },
    speaker: {
      type: String,
    },
    method: {
      type: String,
    },
    method_type: {
      type: String,
    },
    method_sub_type: {
      type: String,
    },
    topic: {
      type: String,
    },
    places: {
      type: String,
    },
    keywords: {
      type: String,
    },
    members_name: {
      type: String,
    },
    page_no: {
      type: String,
    },
    fileurl: {
      type: String,
    },
    content: {
      type: String,
    },
    full_text: {
      type: String,
    },
    session_object_id: {
      type: String,
    },
    question_no: {
      type: String,
    },
    filename: {
      type: String,
    },
    ministry: {
      type: String,
    },
    ministry_name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Debate = mongoose.model("Debate", debateSchema);

module.exports = Debate;
